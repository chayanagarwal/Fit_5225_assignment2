import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'assets/plugins/nucleo/css/nucleo.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'assets/scss/tag-store-dashboard-react.scss'
import { Provider } from 'react-redux'
import Amplify from 'aws-amplify'
import Home from './layouts/Home'
import awsExports from './awsExports'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import FederatedLandingPage from './components/FederatedLandingPage'
import Auth from './layouts/Auth'
import configStore from './store'
Amplify.configure(awsExports)
const store = configStore()

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				<Route path="/admin/tag/upload" component={Home} />
				<Route path="/admin/tag/query" component={Home} />
				<Route path="/federated/landing" render={() => <FederatedLandingPage/>} />
				<Route path="/auth/login" render={() => <Auth />} />
				<Route path="/auth/register" render={() => <Auth />} />
				{/* <Redirect from="/" to="/admin/tag/upload"/> */}
			</Switch>
		</BrowserRouter>
	</Provider>,
	document.getElementById("root")
);
