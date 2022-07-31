import React, { FormEventHandler, useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { db, storage } from '../data/firebaseConfig';

const DropArea = () => {
	const [selectedFile, setSelectedFile] = useState<string>('');
	const titleRef = useRef<HTMLInputElement>(null);

	console.log(selectedFile);

	const onDrop = useCallback((acceptedFile: any) => {
		// setSelectedFile(URL.createObjectURL(new Blob(acceptedFiles)));
		setSelectedFile(
			acceptedFile.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
		);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const title = titleRef!.current!.value;

		const response = await fetch('/api/uploadFile', {
			method: 'POST',
			body: JSON.stringify({ title, selectedFile: selectedFile }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	};

	return (
		<form onSubmit={submitHandler} className='w-[500px] h-[450px] flex flex-col items-center'>
			<input
				ref={titleRef}
				type='text'
				className='mb-5 px-2 py-2 rounded-sm bg-gray-800 outline-none w-full text-gray-50 font-semibold'
				placeholder='title...'
			/>
			<div className='w-full h-full bg-gray-800 rounded-xl p-5'>
				<div
					{...getRootProps()}
					className='bg-gray-700 text-white rounded-xl w-full h-full p-3 text-center flex items-center justify-center flex-col gap-1 text-xl font-bold cursor-pointer'>
					<input {...getInputProps()} />
					{isDragActive ? <p>Drop the file here...</p> : <p>Drop image here, or click to select</p>}
					<p className='text-gray-400 font-medium text-base mb-4'>
						Supported files (jpeg, png, jpg)
					</p>
					<CloudUploadIcon sx={{ fontSize: 90 }} />
				</div>
			</div>
			<button className='mt-5 bg-gray-800 w-full h-[75px] font-semibold rounded-sm hover:bg-gray-700'>
				Upload
			</button>
			{/* <img src={selectedFile} alt='' /> */}
		</form>
	);
};

export default DropArea;
