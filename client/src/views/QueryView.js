import React from 'react'
// reactstrap components
import {
	Container,
	Row,
	Col
} from 'reactstrap'
import QueryTag from '../components/Tag/Query'
import Header from '../components/Headers/Header.js'

class QueryView extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			activeNav: 1
		}
	}
	toggleNavs = (e, index) => {
		e.preventDefault()
		this.setState({
			activeNav: index
		})
	}
	render() {
		return (
			<>
				<Header />
				{/* Page content */}
				<Container className="mt--7" fluid>
					<Row>
						<Col className="mb-5 mb-xl-0" xl="12">
							<QueryTag/>
						</Col>
					</Row>
				</Container>
			</>
		)
	}
}

export default QueryView
