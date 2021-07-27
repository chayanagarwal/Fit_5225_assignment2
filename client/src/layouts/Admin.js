import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
// reactstrap components
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js'
import Sidebar from 'components/Sidebar/Sidebar.js'
import { connect } from 'react-redux'
import routes from 'routes.js'

class Admin extends React.Component {
	componentDidUpdate(e) {
		document.documentElement.scrollTop = 0
		document.scrollingElement.scrollTop = 0
		this.refs.mainContent.scrollTop = 0
	}
	getRoutes = routes => {
		return routes.map((prop, key) => {
			if (prop.layout === '/admin') {
				return(
					<Route
						path={prop.layout + prop.path}
						component={prop.component}
						key={key}
					/>
				)
			} else {
				return null
			}
		})
	}
	render() {
		return (
			<>
				<Sidebar
					{...this.props}
					routes={routes}
				/>
				<div className="main-content" ref="mainContent">
					<AdminNavbar
						{...this.props}
					/>
					<Switch>
						{this.getRoutes(routes)}
					</Switch>
				</div>
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps) (Admin)
