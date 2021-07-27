import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import './style.scss'
import CreatableSelect from 'react-select/creatable'
import { clearImageUrls, queryTags } from '../../../store/actions'
import ShowInfo from '../../../utils/ShowInfo'
import Loader from '../../../utils/Loader'
import TagView from './TagView'

class QueryTag extends React.Component {
	constructor() {
		super()
		this.handleChange = this.handleChange.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.state = {
			tags: [],
			isInProgess: false,
			errorResponse: ''
		}
	}
	/**
	 * 
	 * @param {Array} newValue 
	 * @param {String} actionMeta 
	 */
	handleChange(newValue, actionMeta) {
		let tags = []
		if(newValue){
			tags = newValue.map(value => value.label)
		}
		this.setState({ tags })
	}
	async handleSearch(){
		const { tags } = this.state
		if(tags.length > 0){
			try {
				const { dispatch } = this.props
				dispatch(clearImageUrls())
				this.setState({ isInProgess: true })
				await dispatch(queryTags(tags))
				const { imageUrls } = this.props
				if(imageUrls.length == 0){
					this.setState({ errorResponse: 'Could not find any images!'  })
				}
				this.setState({ isInProgess: false })
			} catch (error) {
				console.error(error);
				this.setState({ isInProgess: false, errorResponse: 'Something went wrong! Please try again.' })
			}
		}
	}
	render() {
		const { tags, isInProgess, errorResponse } = this.state
		const { imageUrls } = this.props
		return (
			<>
			<div className="query-tags">
				<CreatableSelect
					className="query-tag-input"
					placeholder="Type and enter tags"
					isMulti
					onChange={this.handleChange}
					options={tags}
					isDisabled={isInProgess}
				/>
				<Button
					onClick={this.handleSearch}
					disabled={isInProgess}
					className="input-tag-search-button"
					color="secondary">
						Search
					</Button>
			</div>
			{ isInProgess && <div className="query-loader" style={{ textAlign: 'center', marginTop: '5rem' }}><Loader type="Watch" color="#00BFFF" height={80} width={80} /></div> }
			{
				errorResponse && <div className="query-result" style={{ textAlign: 'center', marginTop: '5rem' }}> { errorResponse && <ShowInfo type="error" id="result" message={errorResponse} /> } </div>
			}
			{
				imageUrls && imageUrls.length > 0 && <TagView links={imageUrls} />
			}
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		imageUrls: state.imageUrls
	}
}

export default connect(mapStateToProps) (QueryTag)