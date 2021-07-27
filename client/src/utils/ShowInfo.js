import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default function showInfoMessage(props){
	const { type, message, id } = props
	const messageClasses = classnames(
		'form-text',
		{
			'text-danger': type === 'error'
		}
	)
	return <small style={{ fontWeight: 700 }} id={id} className={messageClasses}>{message}</small>
}

showInfoMessage.propTypes = {
	type: PropTypes.string,
	message: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired
}