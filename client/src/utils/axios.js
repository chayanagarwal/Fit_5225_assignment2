import axios from 'axios'
import { BASE_URL } from './constants'
import LocalStorage from '../utils/LocalStorage'
import { ID_TOKEN_NAME } from '../utils/constants'

const makeRequest = ({ url, method, data }) => {
	return new Promise((resolve, reject) => {
		const options = {
			method,
			url: `${BASE_URL}${url}`,
			data,
			headers: getAuthorizationHeader()
		}
		axios(options)
		.then(response => {
			const { data } = response
			resolve(data)
		})
		.catch(error => {
			if(error){
				console.log(error)
				const { response } = error
				if(response){
					const { data } = response
					reject(data)
				}
			}
			reject(new Error('Error in making the API request'))
		})
	})
}

const getAuthorizationHeader = () => {
	const idToken = LocalStorage.get(ID_TOKEN_NAME)
	const header = {
		Authorization: `Bearer ${idToken}`
	}
	return header
}

export default makeRequest