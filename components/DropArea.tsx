import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { db, storage } from '../data/firebaseConfig';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FileWithPath } from 'react-dropzone';

const DropArea = () => {
	const [selectedFile, setSelectedFile] = useState<FileWithPath>();
	const titleRef = useRef<HTMLInputElement>(null);

	const onDrop = useCallback((acceptedFile: File[]) => {
		setSelectedFile(acceptedFile[0]);
	}, []);
	const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({ onDrop, multiple: false, accept: {
		'image/png': [],
		'image/jpg': [],
		'image/jpeg': [],
		'image/webp': []
	}  });

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedFile) return

		const title = titleRef!.current!.value;

		try {
			const uploadPhoto = await addDoc(collection(db, 'photos'), {
				title,
				createdAt: serverTimestamp(),
			});

			const imgRef = await ref(storage, `photos/${uploadPhoto.id}/${selectedFile!.path}`);

			await uploadBytes(imgRef, selectedFile!, 'data_url').then(async () => {
				const downloadURL = await getDownloadURL(imgRef);
				await updateDoc(doc(db, 'photos', uploadPhoto.id), {
					image: downloadURL,
				});
			});

			console.log(uploadPhoto.id)

			setSelectedFile(undefined)
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<form onSubmit={submitHandler} className='w-[500px] h-[450px] flex flex-col items-center'>
				<input
					ref={titleRef}
					type='text'
					className='mb-5 px-2 py-2 rounded-sm bg-gray-800 outline-none w-full text-gray-50 font-semibold focus:bg-slate-700'
					placeholder='title...'
				/>
				<div className='w-full h-full bg-gray-800 rounded-md p-5'>
					<div
						{...getRootProps()}
						className={`bg-gray-700 text-white rounded-md w-full h-full ${!!fileRejections.length && 'border-solid border-[2px] border-red-400'} ${isDragActive && 'border-solid border-slate-200 border-[1px] bg-gray-600'} p-3 text-center flex items-center justify-center flex-col gap-1 text-xl font-bold cursor-pointer`}>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop the file here...</p>
						) : (
							<p>Drop image here, or click to select</p>
						)}
						<p className='text-gray-400 font-medium text-base'>
							Supported files (jpeg, png, jpg)
						</p>
						{!!fileRejections.length && <p className='text-red-400 text-lg'>File type not supported!</p>}
						{selectedFile ? <img className='w-[120px] mt-3 border-solid border-[2px] border-slate-500 p-3 rounded-lg' src={URL.createObjectURL(selectedFile)} alt='' /> : <CloudUploadIcon sx={{ fontSize: 90 }} className='mt-3' />}
					</div>
				</div>
				<button className='mt-5 bg-gray-800 w-full h-[75px] font-semibold rounded-sm hover:bg-gray-700'>
					Upload
				</button>
			</form>
		</>
	);
};

export default DropArea;
