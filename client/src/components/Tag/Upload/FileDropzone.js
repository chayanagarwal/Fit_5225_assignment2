import React, { useMemo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: '#fafafa',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out'
};

const activeStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};

export default function FileDropzone(props) {
	const onDrop = useCallback(acceptedFiles => {
		props.onFileDropped(acceptedFiles)
	})
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({ accept: 'image/*', onDrop, multiple: false, disabled: props.isDisabled })

	const style = useMemo(() => ({
		...baseStyle,
		...(isDragActive ? activeStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isDragActive,
		isDragReject,
		isDragAccept
	]);

	return (
		<div className="container">
			<div {...getRootProps({ style })}>
				<input {...getInputProps()} />
				<p style={{ color: '#000' }}>Drag 'n' drop your file here, or click to select a file</p>
			</div>
		</div>
	)
}
