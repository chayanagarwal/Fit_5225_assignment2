import Index from './views/UploadView'
import Register from 'views/Register.js'
import Login from './views/Login.js'
import QueryTag from './views/QueryView'

const routes = [
	{
		path: '/tag/upload',
		name: 'Upload Image',
		icon: 'ni ni-tv-2 text-primary',
		component: Index,
		layout: '/admin'
	},
	{
		path: '/tag/query',
		name: 'Query Tag',
		icon: 'ni ni-tv-2 text-primary',
		component: QueryTag,
		layout: '/admin'
	},
	{
		path: '/login',
		name: 'Login',
		icon: 'ni ni-key-25 text-info',
		component: Login,
		layout: '/auth'
	},
	{
		path: '/register',
		name: 'Register',
		icon: 'ni ni-circle-08 text-pink',
		component: Register,
		layout: '/auth'
	}
]
export default routes
