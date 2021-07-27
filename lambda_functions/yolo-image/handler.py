import boto3
import cv2
import numpy as np
import uuid
import os
import base64
from os import listdir

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

threshold = 0.5


class DetectedObject:
    def __init__(self, label, accuracy):
        self.label = label
        self.accuracy = accuracy


class FinalResultObject:
    def __init__(self, objects):
        self.objects = objects


def load_model_files():
    yolo_cfg_file = "/tmp/yolov3.cfg"
    yolo_weights_file = "/tmp/yolov3.weights"
    net = cv2.dnn.readNet(yolo_weights_file, yolo_cfg_file)
    layers_name = net.getLayerNames()
    output_layers = [layers_name[i[0] - 1] for i in net.getUnconnectedOutLayers()]
    return net, output_layers


def get_yolo_labels():
    labels = []
    with open("/tmp/coco.names", "r") as f:
        labels = [line.strip() for line in f.readlines()]
    return labels


def detect_objects(image, model, output_layers):
    blob = cv2.dnn.blobFromImage(image, scalefactor=0.00392, size=(320, 320), mean=(0, 0, 0), swapRB=True, crop=False)
    model.setInput(blob)
    algo_output = model.forward(output_layers)
    return algo_output


def generate_result(algo_output):
    labels = get_yolo_labels()
    result_list = []
    for output in algo_output:
        for item in output:
            scores = item[5:]
            label_id = np.argmax(scores)
            confidence = scores[label_id]
            if confidence > threshold:
                result_list.append(DetectedObject(labels[label_id], str(round(float(confidence) * 100, 2))).__dict__)
    # print(result_list)
    return result_list


def write_to_file(save_path, data):
    with open(save_path, "wb") as f:
        f.write(base64.b64decode(data))


def put_url_in_db(tag, url):
    response = None
    try:
        dynamoTable = dynamodb.Table('TagStore')
        response = dynamoTable.put_item(
            Item={
                "tag": tag,
                "urlList": [url]
            },
            ConditionExpression='attribute_not_exists(tag)'
        )

    except Exception as e:
        response = dynamoTable.update_item(
            UpdateExpression="SET urlList = list_append(urlList,:i)",
            ExpressionAttributeValues={
                ":i": [url],
            },
            ReturnValues="UPDATED_NEW",
            Key={
                "tag": tag,
            }
        )
    return response


def yolo_image(event, context):
    bucketName = event['Records'][0]['s3']['bucket']['name']
    yoloFilesBucketName = 'yolo-files-bucket'
    bucketKey = event['Records'][0]['s3']['object']['key']
    object1 = s3.get_object(Bucket=bucketName, Key=bucketKey)
    strWeightFile = '/tmp/yolov3.weights'
    strKey = 'yolov3.weights'
    strConfigFile = '/tmp/yolov3.cfg'
    strConfigKey = 'yolov3.cfg'
    strCocoFile = '/tmp/coco.names'
    strCocoKey = 'coco.names'
    s3.download_file(yoloFilesBucketName, strKey, strWeightFile)
    s3.download_file(yoloFilesBucketName, strConfigKey, strConfigFile)
    s3.download_file(yoloFilesBucketName, strCocoKey, strCocoFile)
    nparr = np.frombuffer(object1["Body"].read(), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.resize(img, None, fx=0.4, fy=0.4)
    model, output_layers = load_model_files()
    algo_output = detect_objects(img, model, output_layers)
    result = generate_result(algo_output)
    result_list = [d['label'] for d in result if 'label' in d]
    result = list(set(result_list))
    for item in result:
        print(item)
        put_url_in_db(item, bucketKey)