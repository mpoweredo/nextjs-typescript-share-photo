import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { db, storage } from '../data/firebaseConfig';

const DropArea = () => {
	const [selectedFile, setSelectedFile] = useState<string>('');

	const onDrop = useCallback((acceptedFiles: any) => {
		console.log(acceptedFiles);
		setSelectedFile(URL.createObjectURL(new Blob(acceptedFiles)));
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

	return (
		<div className='w-[500px] h-[400px] flex flex-col items-center'>
            <input type="text" className='mb-5 px-2 py-2 rounded-sm bg-gray-800 outline-none w-full text-gray-50 font-semibold' placeholder='title...' />
			<div className='w-full h-full bg-gray-800 rounded-2xl p-5'>
				<div
					{...getRootProps()}
					className='bg-gray-700 text-white rounded-2xl w-full h-full p-3 text-center flex items-center justify-center flex-col gap-1 text-xl font-bold cursor-pointer'>
					<input {...getInputProps()} />
					{isDragActive ? <p>Drop the file here...</p> : <p>Drop image here, or click to select</p>}
                    <p className='text-gray-400 font-medium text-base mb-4'>Supported files (jpeg, png, jpg)</p>
					<CloudUploadIcon sx={{ fontSize: 90 }} />
				</div>
			</div>
            <button className='mt-5 bg-gray-800 w-full h-[70px] rounded-sm hover:bg-gray-700'>Upload</button>
			<img src={selectedFile} alt='' />
		</div>
	);
};

export default DropArea;
