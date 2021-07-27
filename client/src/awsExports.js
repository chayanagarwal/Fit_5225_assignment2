import { STATIC_WEBSITE_BASE_URL } from './utils/constants'

const redirectSignIn = `${STATIC_WEBSITE_BASE_URL}/federated/landing`
const redirectSignOut = `${STATIC_WEBSITE_BASE_URL}/auth/login`

const awsConfig = {
	'aws_project_region': 'us-east-1',
	'aws_cognito_identity_pool_id': 'us-east-1:e36fe97c-038c-443d-8b6e-a05f22fd23c4',
	'aws_cognito_region': 'us-east-1',
	'aws_user_pools_id': 'us-east-1_1FJGYvaUr',
	'aws_user_pools_web_client_id': 'pq3q8mvlhn433elfqvlnti1ng',
	'oauth': {
		'domain': 'tag-store-fit-5225.auth.us-east-1.amazoncognito.com/',
		'scope': [
			'profile',
			'email',
			'openid',
			'aws.cognito.signin.user.admin'
		],
		'redirectSignIn': redirectSignIn,
		'redirectSignOut': redirectSignOut,
		'responseType': 'token'
	},
	'federationTarget': 'COGNITO_USER_POOLS'
}
export default awsConfig