import React from 'react'
import {
	Tooltip
} from 'reactstrap'

export default class PasswordPolicyTooltip extends React.Component {
	constructor() {
		super()
		this.state = {
			isTootooltipOpen: false
		}
		this.toggleTooltip = this.toggleTooltip.bind(this)
	}
	toggleTooltip(){
		const { isTootooltipOpen } = this.state
		this.setState({ isTootooltipOpen: !isTootooltipOpen })
	}
	render() {
		const { isTootooltipOpen } = this.state
		return (
			<>
				<Tooltip placement="right" isOpen={isTootooltipOpen} target="password-helper" toggle={() => this.toggleTooltip()}>
					Password must have at least one number, one lowercase and one uppercase letter, one special character
					and must at least 8 characters long.
				</Tooltip>
			</>
		)
	}
}