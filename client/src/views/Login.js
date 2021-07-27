import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Auth, Hub } from 'aws-amplify'
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Col
} from 'reactstrap'
import { EMAIL_REGEX } from '../utils/constants'
import Loader from '../utils/Loader'
import ShowInfo from '../utils/ShowInfo'
import { auth } from '../store/actions'

const getDefaultFormState = () => {
	return {
		email: '',
		password: ''
	}
}
const getDefaultState = () => {
	return {
		...getDefaultFormState(),
		errors: {
			...getDefaultFormState()
		},
		errorResponse: '',
		isInProgress: false
	}
}

class Login extends React.Component {
	constructor() {
		super()
		this.state = getDefaultState()
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.isFormValid = this.isFormValid.bind(this)
	}
	/**
	 * 
	 * @param {Event} event 
	 */
	handleChange(event) {
		const { name, value } = event.target

		let { errors } = this.state
		switch (name) {
			case 'email':
				errors.email = EMAIL_REGEX.test(value) ? '' : 'Email is not valid!'
				break
			case 'password':
				errors.password = value ? '' : 'Invalid password'
				break
			default:
				break
		}
		this.setState({ errors, [name]: value })
	}
	async handleSubmit() {
		if (this.isFormValid()) {
			try {
				const { dispatch } = this.props
				this.setState({ errors: getDefaultFormState(), isInProgress: true, errorResponse: '' })
				const { email, password } = this.state
				await dispatch(auth({ email, password }))
				this.setState({ ...getDefaultState() })
				this.props.history.replace('/admin/tag/upload')
			} catch (error) {
				console.error('error signing in', error);
				const { message } = error
				this.setState({ errorResponse: message, isInProgress: false })
			}
		}
	}
	isFormValid() {
		let isValid = true
		const { email, password } = this.state
		if (!EMAIL_REGEX.test(email)) isValid = false
		if (!password) isValid = false
		return isValid
	}
	/**
	 * 
	 * @param {Event} event 
	 */
	federatedGoogleLogin(event) {
		event.preventDefault()
		Auth.federatedSignIn({ provider: 'Google' })
	}
	render() {
		const { email, password, errors, errorResponse, isInProgress } = this.state
		return (
			<>
				<Col lg="5" md="7">
					<Card className="bg-secondary shadow border-0">
						<CardHeader className="bg-transparent pb-5">
							<div className="text-muted text-center mt-2 mb-3">
								<small>Sign in with</small>
							</div>
							<div className="btn-wrapper text-center">
								<Button
									className="btn-neutral btn-icon"
									color="default"
									type="button"
									onClick={this.federatedGoogleLogin}
								>
									<span className="btn-inner--icon">
										<img
											alt="..."
											src={require("assets/img/icons/common/google.svg")}
										/>
									</span>
									<span className="btn-inner--text">Google</span>
								</Button>
							</div>
						</CardHeader>
						<CardBody className="px-lg-5 py-lg-5">
							<div className="text-center text-muted mb-4">
								<small>Or sign in with credentials</small>
							</div>
							<Form role="form">
								<FormGroup className="mb-3">
									<InputGroup className="input-group-alternative">
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												<i className="ni ni-email-83" />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder="Email"
											type="email"
											name="email"
											value={email}
											onChange={this.handleChange}
										/>
									</InputGroup>
									{errors.email && <ShowInfo id="email-info" message={errors.email} type="error" />}
								</FormGroup>
								<FormGroup>
									<InputGroup className="input-group-alternative">
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												<i className="ni ni-lock-circle-open" />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder="Password"
											type="password"
											name="password"
											value={password}
											onChange={this.handleChange}
										/>
									</InputGroup>
									{errors.password && <ShowInfo id="password-info" message={errors.password} type="error" />}
								</FormGroup>
								<div className="text-center">
									{errorResponse && <ShowInfo id="error-info" message={errorResponse} type="error" />}
									<Button disabled={isInProgress} onClick={this.handleSubmit} className="mt-4" color="primary" type="button">
										{isInProgress ? <Loader color="#fff" width={100} height={20} /> : "Sign In"}
									</Button>
								</div>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</>
		)
	}
}

export default withRouter(connect()(Login))
