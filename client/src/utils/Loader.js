import React from 'react'
import Loader from 'react-loader-spinner'
import PropTypes from 'prop-types'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

function loader(props){
	const { color, type, height, width } = props
	return(
		<Loader
		 type={type ? type : "ThreeDots"}
		 color={color ? color: "#00BFFF"}
		 height={height ? height : 100}
		 width={width ? width : 100}
	  />
	)
}

loader.propTypes = {
	color: PropTypes.string,
	height: PropTypes.number,
	type: PropTypes.string,
	width: PropTypes.number
}

export default loader