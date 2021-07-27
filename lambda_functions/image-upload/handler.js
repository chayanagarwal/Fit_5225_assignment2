const AWS = require('aws-sdk')
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
const BUCKET_NAME = process.env.BUCKET_NAME
const promisify = require('util').promisify
const UploadPromise = promisify(s3.upload).bind(s3)
const fileType = require('file-type')

module.exports.upload = async event => {
	try {
		const eventBody = JSON.parse(event.body)
		const { file, fileName } = eventBody
		const splitFile = file.split('base64,')
		const base64String = splitFile[splitFile.length - 1]
		const fileBuffer = Buffer.from(base64String, 'base64')
		const mimeInfo = await fileType.fromBuffer(fileBuffer)
		
		const { mime } = mimeInfo

		const params = {
			Body: fileBuffer,
			Bucket: BUCKET_NAME,
			Key: `${Date.now().toString()}-${fileName}`,
			ContentType: mime,
			ACL: 'public-read'
		}
		const uploadResponse = await UploadPromise(params)
		console.log(uploadResponse)
		const successResponse = {
			headers: {
				"Access-Control-Allow-Origin": "*", 
				"Access-Control-Allow-Credentials": true
			},
			'statusCode': 200,
			'body': JSON.stringify({ message: 'success' }, null, 2),
			'isBase64Encoded': false
		}
		return successResponse
	} catch (error) {
		const { message } = error
		console.error('Error in image upload', message)
		const errorResponse = {
			headers: {
				"Access-Control-Allow-Origin": "*", 
				"Access-Control-Allow-Credentials": true
			},
			'statusCode': 400,
			'body': JSON.stringify({ error: message }, null, 2),
			'isBase64Encoded': false
		}
		return errorResponse
	}
}