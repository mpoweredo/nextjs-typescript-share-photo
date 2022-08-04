import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { db, storage } from '../data/firebaseConfig';
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	snapshotEqual,
	updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { FileWithPath } from 'react-dropzone';
import Link from 'next/link';

const DropArea = () => {
	const [selectedFile, setSelectedFile] = useState<FileWithPath>();
	const titleRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [photoId, setPhotoID] = useState<string>();
	const [progress, setProgress] = useState<number>(0);

	const onDrop = useCallback((acceptedFile: File[]) => {
		setSelectedFile(acceptedFile[0]);
	}, []);
	const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
		onDrop,
		multiple: false,
		accept: {
			'image/png': [],
			'image/jpg': [],
			'image/jpeg': [],
			'image/webp': [],
		},
	});

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedFile) return;

		const title = titleRef!.current!.value;

		try {
			setIsUploading(true);
			const uploadPhoto = await addDoc(collection(db, 'photos'), {
				title,
				createdAt: serverTimestamp(),
			});

			const imgRef = await ref(storage, `photos/${uploadPhoto.id}/${selectedFile!.path}`);

			const uploadTask = uploadBytesResumable(imgRef, selectedFile!)

			uploadTask.on(
				'state_changed',
				snapshot => {
					setProgress(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
				},
				error => {
					console.log('something went wrong...');
				},
				async () => {
					const downloadURL = await getDownloadURL(imgRef);
					await updateDoc(doc(db, 'photos', uploadPhoto.id), {
						image: downloadURL,
					});

					setPhotoID(uploadPhoto.id);
					setSelectedFile(undefined);
					setIsUploading(false);
					setProgress(0)
				}
			);
		} catch (error) {
			setIsUploading(false);
		}
	};

	return (
		<div className='flex flex-col px-2'>
			<form onSubmit={submitHandler} className='sm:w-[500px] h-[450px] flex flex-col items-center'>
				<input
					ref={titleRef}
					type='text'
					className='mb-5 px-2 py-2 rounded-sm bg-gray-800 outline-none w-full text-gray-50 font-semibold focus:bg-slate-700'
					placeholder='title...'
				/>
				<div className='w-full h-full bg-gray-800 rounded-md p-5'>
					<div
						{...getRootProps()}
						className={`bg-gray-700 text-white rounded-md w-full h-full ${
							!!fileRejections.length && 'border-solid border-[2px] border-red-400'
						} ${
							isDragActive && 'border-solid border-slate-200 border-[1px] bg-gray-600'
						} p-3 text-center flex items-center justify-center flex-col gap-1 text-xl font-bold cursor-pointer`}>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop the file here...</p>
						) : (
							<p>Drop image here, or click to select</p>
						)}

						<p className='text-gray-400 font-medium text-base'>
							Supported files (jpeg, png, jpg, webp)
						</p>

						{!!fileRejections.length &&
							fileRejections[0].errors[0].code === 'file-invalid-type' && (
								<p className='text-red-400 text-lg'>File type not supported</p>
							)}

						{!!fileRejections.length && fileRejections[0].errors[0]?.code === 'too-many-files' && (
							<p className='text-red-400 text-lg'>Too many files! Only one is allowed</p>
						)}

						{selectedFile ? (
							<img
								className='w-[120px] mt-3 border-solid border-[2px] border-slate-500 p-2 rounded-md'
								src={URL.createObjectURL(selectedFile)}
								alt=''
							/>
						) : (
							<CloudUploadIcon sx={{ fontSize: 90 }} className='mt-3' />
						)}

						{progress !== 0 && <div className='h-2 w-64 rounded-full bg-slate-600 overflow-hidden mt-3'>
							<div className={`bg-sky-400 h-full`} style={{width: `${progress}%`}} ></div>
						</div>}
					</div>
				</div>
				<button
					disabled={isUploading}
					className={`mt-5 bg-gray-800 w-full h-[75px] font-semibold rounded-sm hover:bg-gray-700 ${
						isUploading && 'bg-gray-600 text-gray-400'
					}`}>
					Upload
				</button>
			</form>
			{photoId && (
				<Link href={`/${photoId}`}>
					<button
						className='mt-5 bg-emerald-500 w-full h-[50px] font-semibold rounded-sm hover:bg-emerald-600 
						 text-slate-900'>
						Your link
					</button>
				</Link>
			)}
		</div>
	);
};

export default DropArea;
