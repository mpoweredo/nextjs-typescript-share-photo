import Link from 'next/link';
import React from 'react';

type Props = {
	createdAt: string;
	title: string;
	image: string;
};

const PhotoItem = ({ title, image, createdAt }: Props) => {
	return (
		<div className='flex flex-col gap-4 items-center justify-center'>
			<h1 className='text-3xl font-bold text-center text-slate-400'>
				{title} co tam u was kociaczki xd
			</h1>
			<div className='w-2/5'>
				<img src={image} alt=''/>
			</div>
			<p className='text-[16px] font-medium text-slate-600'>
				Created at: <span className='font-bold text-slate-500'>{createdAt}</span>
			</p>
			<Link href='/'>
				<button
					className='mt-5 bg-gray-800 w-[300px] h-[50px] font-semibold rounded-sm hover:bg-gray-700 
						 text-slate-200'>
					Send again
				</button>
			</Link>
		</div>
	);
};

export default PhotoItem;
