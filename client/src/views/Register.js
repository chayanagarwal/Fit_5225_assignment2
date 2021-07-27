import React from 'react'
import { Auth } from 'aws-amplify'
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
import { EMAIL_REGEX, PASSWORD_REGEX } from '../utils/constants'
import ShowInfo from '../utils/ShowInfo'
import Loader from '../utils/Loader'
import PasswordPolicyTooltip from '../utils/PasswordPolicyTooltip'

const getDefaultFormState = () => {
	return {
		firstName: '',
		lastName: '',
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
		successResponse: '',
		isInProgress: false
	}
}

class Register extends React.Component {
	constructor() {
		super()
		this.state = getDefaultState()
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.isFormValid = this.isFormValid.bind(this)
	}
	federatedGoogleSignUp(event) {
		event.preventDefault()
		Auth.federatedSignIn({ provider: 'Google' })
	}
	/**
	 * 
	 * @param {Event} event 
	 */
	handleChange(event) {
		const { name, value } = event.target

		let { errors } = this.state
		switch (name) {
			case 'firstName':
				errors.firstName = value.length < 2 ? 'First name must be 2 characters long!' : ''
				break
			case 'lastName':
				errors.lastName = value.length < 2 ? 'Last name must be 2 characters long!' : ''
				break
			case 'email':
				errors.email = EMAIL_REGEX.test(value) ? '' : 'Email is not valid!'
				break
			case 'password':
				errors.password = PASSWORD_REGEX.test(value) ? '' : 'Gievn password does not match the password policy!'
				break
			default:
				break
		}
		this.setState({ errors, [name]: value })
	}
	async handleSubmit() {
		if (this.isFormValid()) {
			try {
				this.setState({ errors: getDefaultFormState(), isInProgress: true })
				const { firstName, lastName, email, password } = this.state
				await Auth.signUp({
					username: email,
					password,
					attributes: {
						email,
						given_name: firstName,
						family_name: lastName,
					}
				})
				this.setState({ errors: getDefaultFormState(), isInProgress: false, ...getDefaultFormState(), successResponse: 'A verification link has been sent to your email. Please wait while we redirect you to the login page.'  })
				setTimeout(() => {
					this.props.history.replace('/auth/login')
				}, 3000)
			} catch (error) {
				console.log('error signing up:', error);
				const { message } = error
				this.setState({ errorResponse: message, isInProgress: false })
			}
		}
	}
	isFormValid() {
		let isValid = true
		const { email, firstName, lastName, password } = this.state
		if (!EMAIL_REGEX.test(email)) isValid = false
		if (firstName.length < 2) isValid = false
		if (lastName.length < 2) isValid = false
		if (!PASSWORD_REGEX.test(password)) isValid = false
		return isValid
	}
	render() {
		const { firstName, lastName, email, password, errors, isInProgress, successResponse, errorResponse } = this.state
		return (
			<>
				<Col lg="6" md="8">
					<Card className="bg-secondary shadow border-0">
						<CardHeader className="bg-transparent pb-5">
							<div className="text-muted text-center mt-2 mb-4">
								<small>Sign up with</small>
							</div>
							<div className="text-center">
								<Button
									className="btn-neutral btn-icon"
									color="default"
									href="#!"
									onClick={this.federatedGoogleSignUp}
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
								<small>Or sign up with email and password</small>
							</div>
							<Form role="form">
								<FormGroup>
									<label>First Name</label>
									<InputGroup className="input-group-alternative mb-3">
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												<i className="ni ni-hat-3" />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											name="firstName"
											value={firstName}
											placeholder="First Name"
											type="text"
											onChange={this.handleChange}
										/>
									</InputGroup>
									{errors.firstName && <ShowInfo id="firstName-info" message={errors.firstName} type="error" />}
								</FormGroup>
								<FormGroup>
									<label>Last Name</label>
									<InputGroup className="input-group-alternative mb-3">
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												<i className="ni ni-hat-3" />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											name="lastName"
											value={lastName}
											placeholder="Last Name"
											type="text"
											onChange={this.handleChange}
										/>
									</InputGroup>
									{errors.lastName && <ShowInfo id="lastName-info" message={errors.lastName} type="error" />}
								</FormGroup>
								<FormGroup>
									<label>Email</label>
									<InputGroup className="input-group-alternative mb-3">
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												<i className="ni ni-email-83" />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder="Email"
											value={email}
											name="email"
											type="email"
											onChange={this.handleChange}
										/>
									</InputGroup>
									{errors.email && <ShowInfo id="email-info" message={errors.email} type="error" />}
								</FormGroup>
								<FormGroup>
								<label>Password</label>
									<InputGroup className="input-group-alternative mb-3">
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												<i className="ni ni-email-83" />
											</InputGroupText>
										</InputGroupAddon>
										<Input
											placeholder="Password"
											value={password}
											name="password"
											type="password"
											onChange={this.handleChange}
										/>
									</InputGroup>
									{errors.password && <ShowInfo id="password-info" message={errors.password} type="error" />}
									<p>
										Password Plolicy
										<i style={{ marginLeft: '10px' }} className="fas fa-info-circle" id="password-helper">
												<PasswordPolicyTooltip />
										</i>
									</p>
								</FormGroup>
								<div className="text-center">
									{successResponse && <ShowInfo id="success-info" message={successResponse} />}
									{errorResponse && <ShowInfo id="error-info" message={errorResponse} type="error" />}
									<Button disabled={isInProgress} onClick={this.handleSubmit} className="mt-4" color="primary" type="button">
										{isInProgress ? <Loader color="#fff" width={100} height={20} /> : "Create account"}
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

export default Register
