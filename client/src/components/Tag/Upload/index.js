import React from 'react'
import Loader from 'react-loader-spinner'
import FileDropzone from './FileDropzone'
import makeRequest from '../../../utils/axios'
import { IMAGE_UPLOAD_URL } from '../../../utils/constants'
import ShowInfo from '../../../utils/ShowInfo'
const getDefaultState = () => {
	return {
		fileName: '',
		fileBase64String: '',
		isDisabled: false,
		isFileUploadInProgress: false,
		errorResponse: '',
		successResponse: ''
	}
}

class ImageUpload extends React.Component {
	constructor() {
		super()
		this.onFileDropped = this.onFileDropped.bind(this)
		this.uploadFile = this.uploadFile.bind(this)
		this.state = getDefaultState()
	}
	/**
	 * 
	 * @param {Array} files 
	 */
	async onFileDropped(files) {
		this.setState({ isDisabled: true, errorResponse: '', isFileUploadInProgress: true, successResponse: '' })
		try {
			const { name, base64String } = await this.convertFileTobase64(files[0])
			this.setState({ fileName: name, fileBase64String: base64String })
			this.uploadFile()
		} catch (error) {
			this.setState({ errorResponse: 'Something went wrong! Please try again.', isDisabled: false })
		}
	}
	convertFileTobase64(file) {
		return new Promise((resolve, reject) => {
			const { name } = file
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = function () {
				resolve({ name, base64String: reader.result })
			}
			reader.onerror = function (error) {
				reject(error)
			}
		})
	}
	async uploadFile() {
		try {
			const { fileName, fileBase64String } = this.state
			const response = await makeRequest({ url: IMAGE_UPLOAD_URL, method: 'POST', data: { file: fileBase64String, fileName } })
			this.setState({ ...getDefaultState(), successResponse: 'Image uploaded successfully!' })
		} catch (error) {
			this.setState({ errorResponse: 'Something went wrong! Please try again.', isDisabled: false, isFileUploadInProgress: false })
		}
	}
	render() {
		const { errorResponse, isFileUploadInProgress, successResponse } = this.state
		return (
			<>
				<FileDropzone
					onFileDropped={this.onFileDropped}
					isDisabled={this.state.isDisabled}
				/>
				{ isFileUploadInProgress && <div className="loader" style={{ textAlign: 'center', marginTop: '5rem' }}><Loader type="Watch" color="#00BFFF" height={80} width={80} /></div> }
				{ errorResponse && <div className="show-error" style={{ textAlign: 'center', marginTop: '5rem' }}> <ShowInfo id="error-info" message={errorResponse} type="error" /></div> }
				{ successResponse && <div className="show-info" style={{ textAlign: 'center', marginTop: '5rem' }}> <ShowInfo id="error-info" message={successResponse} /></div> }
			</>
		)
	}
}

export default ImageUpload