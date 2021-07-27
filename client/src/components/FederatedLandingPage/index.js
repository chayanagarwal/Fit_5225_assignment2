import React from 'react'
import { Auth, Hub } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import { extractRequiredTokensAndReturnuserData } from '../../store/actions'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actionTypes'

class FederatedLandingPage extends React.Component {
	constructor() {
		super()
		this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this)
	}
	componentDidMount() {
		Hub.listen('auth', (data) => {
			const { payload } = data
			if (payload.event === 'signIn') {
				this.handleSuccessfulLogin()
			}
		})
	}
	handleSuccessfulLogin() {
		Auth.currentAuthenticatedUser()
			.then(user => {
				const { dispatch } = this.props
				const userData = extractRequiredTokensAndReturnuserData(user)
				dispatch({ type: actionTypes.SET_USER_AUTH_DATA, payload: userData })
				this.props.history.replace('/admin/tag/upload')
			})
			.catch(error => console.error(error))
	}
	render() {
		return (<h1 style={{ textAlign: 'center', marginTop: '10rem' }}>Redirecting...</h1>)
	}
}
export default withRouter(connect()(FederatedLandingPage))