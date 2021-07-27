import * as actionTypes from './actionTypes'
const initialState = {
	user: {},
	imageUrls: []
}

const reducer = (state = initialState, action) => {
	switch(action.type){
		case actionTypes.SET_USER_AUTH_DATA:
			return {
				user:{
					...action.payload
				}
			}
		case actionTypes.SET_IMAGE_URLS:
			return {
				...state,
				imageUrls: action.payload
			}
		default:
			return state
	}
}

export default reducer