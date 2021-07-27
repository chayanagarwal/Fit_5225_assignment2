import { Auth } from 'aws-amplify'
import LocalStorage from '../utils/LocalStorage'
import { ID_TOKEN_NAME, REFRESH_TOKEN_NAME, QUERY_TAG_URL } from '../utils/constants'
import * as actionTypes from './actionTypes'
import makeRequest from '../utils/axios'

export function auth({ email, password }){
	return async dispatch => {
		try {
			const user = await Auth.signIn(email, password)
			const userData = extractRequiredTokensAndReturnuserData(user)
			return dispatch({ type: actionTypes.SET_USER_AUTH_DATA, payload: userData })
		} catch (error) {
			throw error
		}
	}
}

/**
 * 
 * @param {Object} obj 
 */
export const extractRequiredTokensAndReturnuserData = obj => {
	const { signInUserSession } = obj
	const { idToken, refreshToken } = signInUserSession
	const { jwtToken } = idToken
	const { token } = refreshToken
	LocalStorage.set(ID_TOKEN_NAME, jwtToken)
	LocalStorage.set(REFRESH_TOKEN_NAME, token)
	const userData = LocalStorage.getUserDataFromToken()
	return userData
}

export function queryTags(tags){
	return async dispatch => {
		try {
			const data = await makeRequest({ url: QUERY_TAG_URL, method: 'POST', data: { tags } })
			dispatch({ type: actionTypes.SET_IMAGE_URLS, payload: data.links })
		} catch (error) {
			throw error
		}
	}
}

export function clearImageUrls(){
	return { type: actionTypes.SET_IMAGE_URLS, payload: [] }
}


export async function logUserOut(){
	try {
		await Auth.signOut({ global: true })
		LocalStorage.removeAll()
	} catch (error) {
		
	}
}

export function setSessionDataIfAny(){
	return dispatch => {
		const userData = LocalStorage.getUserDataFromToken()
		if(userData){
			return dispatch({ type: actionTypes.SET_USER_AUTH_DATA, payload: userData })
		}
	}
}