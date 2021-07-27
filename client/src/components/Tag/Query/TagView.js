import React from 'react'
const TagImageView = props => {
	return(
		<div className="query-result">
			<div className="image-row">
				<div className="image-column">
					{returnImages(props.links)}
				</div>
			</div>
		</div>
	)
}

const returnImages = (links) => {
	return links.map(link => <img key={link} src={link} />)
}

export default TagImageView