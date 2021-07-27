const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()
const TABLE_NAME = process.env.TABLE_NAME
const DB_DATA_KEY = process.env.DB_DATA_KEY
const LIST_DATA_TYPE = 'L'
const STRING_DATA_TYPE = 'S'
const DATA_NAME = 'tag'
const promisify = require('util').promisify
const BatchGetItem = promisify(dynamodb.batchGetItem).bind(dynamodb)
const BUCKET_URL = process.env.BUCKET_URL

module.exports.query = async event => {
	try {
		const requestBody = JSON.parse(event.body)
		const { tags } = requestBody
		const individualKeyQueries = tags.map(tag => makeGetBatchItemParams(tag))
		const params = returnCompleteQuery(individualKeyQueries)
		const result = await BatchGetItem(params)
		const { Responses } = result
		const tagResponses = Responses[TABLE_NAME]
		const cleanedUpData = tagResponses.map(response => cleanDynamoResponse(response))
		const flattenedArrayData = [].concat.apply([], cleanedUpData)
		return {
			statusCode: 200,
			body: JSON.stringify({ links: flattenedArrayData }, null, 2),
			headers: {
				"Access-Control-Allow-Origin": "*", 
				"Access-Control-Allow-Credentials": true
			}
		}
	} catch (error) {
		console.error(error)
		const { message, code } = error
		return {
			statusCode: code || 400,
			body: JSON.stringify({ message }, null, 2),
			headers: {
				"Access-Control-Allow-Origin": "*", 
				"Access-Control-Allow-Credentials": true
			}
		}
	}
}

/**
 * 
 * @param {String} tag 
 */
const makeGetBatchItemParams = tag => {
	return {
		[DATA_NAME]: {
			S: tag.toLowerCase()
		}
	}
}

/**
 * 
 * @param {Array} individualKeyArray 
 */
const returnCompleteQuery = (individualKeyArray) => {
	if(!(individualKeyArray instanceof Array)){
		throw Error('Input has to be an array')
	}
	return {
		RequestItems: {
			[TABLE_NAME]: {
				Keys: individualKeyArray
			}
		}
	}
}

/**
 * 
 * @param {Object} dataObject 
 */
const cleanDynamoResponse = dataObject => {
	const dbDataToClean = dataObject[DB_DATA_KEY]
	const dataList = dbDataToClean[LIST_DATA_TYPE]
	return extractDataFromDataList(dataList)
}

/**
 * 
 * @param {Array} dataList 
 */

const extractDataFromDataList = dataList => {
	return dataList.map(data => `${BUCKET_URL}/${data[STRING_DATA_TYPE]}`)
}
