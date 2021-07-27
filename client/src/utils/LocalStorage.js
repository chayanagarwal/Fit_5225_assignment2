import { ID_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../utils/constants'
class LocalStorage {
	static get(name) {
		return localStorage.getItem(name)
	}
	static set(name, value) {
		localStorage.setItem(name, value)
	}

	static removeIdToken() {
		localStorage.removeItem(ID_TOKEN_NAME)
	}

	static removeRefreshToken() {
		localStorage.removeItem(REFRESH_TOKEN_NAME)
	}

	static removeAll() {
		localStorage.clear()
	}

	static decodeToken(name = ID_TOKEN_NAME) {
		const token = localStorage.getItem(name)
		if (token) {
			const base64Url = token.split('.')[1]
			if (base64Url) {
				const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
				const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				}).join(''))
				return JSON.parse(jsonPayload)
			}
		}
	}
	static getUserDataFromToken() {
		const data = LocalStorage.decodeToken()
		if (data) {
			const {
				email, family_name, given_name,
			} = data
			return {
				email,
				name: `${given_name} ${family_name}`,
				firstName: given_name,
				lastName: family_name
			}
		}
	}
}

export default LocalStorage