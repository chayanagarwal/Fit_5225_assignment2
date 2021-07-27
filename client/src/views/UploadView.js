import React from 'react'
// reactstrap components
import {
	Container,
	Row,
	Col
} from 'reactstrap'
import ImageUpload from '../components/Tag/Upload'
import Header from "components/Headers/Header.js"

class UploadView extends React.Component {
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
							<ImageUpload/>
						</Col>
					</Row>
				</Container>
			</>
		)
	}
}

export default UploadView
