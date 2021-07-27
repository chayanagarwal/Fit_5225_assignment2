import React from 'react'
import { Link } from 'react-router-dom'
// reactstrap components
import {
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Navbar,
	Nav,
	Container,
	Media
} from 'reactstrap'
import { logUserOut } from '../../store/actions'

/**
 * 
 * @param {Event} event 
 */
const logOut = (event) => { 
	event.preventDefault()
	logUserOut().then(() => {
		window.location.reload()
	})
}

const AdminNavbar = props => {
	const { user: { name } } = props
	return (
		<>
			<Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
				<Container fluid>
					<Link
						className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
						to="/"
					>
						{props.brandText}
					</Link>
					<Nav className="align-items-center d-none d-md-flex" navbar>
						<UncontrolledDropdown nav>
							<DropdownToggle className="pr-0" nav>
								<Media className="align-items-center">
									<Media className="ml-2 d-none d-lg-block">
										<span className="mb-0 text-sm font-weight-bold">
											{name}
										</span>
									</Media>
								</Media>
							</DropdownToggle>
							<DropdownMenu className="dropdown-menu-arrow" right>
								<DropdownItem className="noti-title" header tag="div">
									<h6 className="text-overflow m-0">Welcome!</h6>
								</DropdownItem>
								<DropdownItem href="#pablo" onClick={logOut}>
									<i className="ni ni-user-run" />
									<span>Logout</span>
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</Nav>
				</Container>
			</Navbar>
		</>
	)
}

export default AdminNavbar
