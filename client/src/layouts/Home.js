import React from 'react'
import { connect } from 'react-redux'
import AdminLayout from './Admin'
import { setSessionDataIfAny } from '../store/actions'
import Auth from './Auth'
import LocalStorage from '../utils/LocalStorage'

class Home extends React.Component{
	constructor(){
		super()
		this.isUserAuthenticated = this.isUserAuthenticated.bind(this)
	}
	isUserAuthenticated(){
		const { user } = this.props
		if(user['name']) return true
		else{
			if(LocalStorage.decodeToken()){
				return true
			}
			return false
		}
	}
	componentWillMount(){
		const { dispatch } = this.props
		dispatch(setSessionDataIfAny())
	}
	render(){
		return(
			<div>
				{this.isUserAuthenticated() ? <AdminLayout /> : <Auth />}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps) (Home)