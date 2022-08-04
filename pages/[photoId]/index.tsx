import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../data/firebaseConfig';
import { PhotoData } from '../../types/types';
import { formatDate } from '../../helpers/convertDate';
import PhotoItem from '../../components/PhotoItem';

type Props = {
	photoData: PhotoData;
};

const PhotoPage: NextPage<Props> = ({ photoData }) => {
	const convertedDate = formatDate(photoData.createdAt);

	return (
		<div className='h-screen w-100 bg-[#121316] text-white text-lg flex items-center justify-center'>
			<PhotoItem title={photoData.title} createdAt={convertedDate} image={photoData.image} />
		</div>
	);
};

export default PhotoPage;

export const getServerSideProps: GetServerSideProps = async context => {

	const photoId = context.query.photoId as string;

	const docRef = doc(db, 'photos', photoId);
	const docSnap = await getDoc(docRef);

	const fetchedData = docSnap.data();

	if (!fetchedData) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const photoData: PhotoData = {
		title: fetchedData!.title,
		image: fetchedData!.image,
		createdAt: fetchedData!.createdAt.toDate(),
	};

	return {
		props: {
			photoData: JSON.parse(JSON.stringify(photoData)),
		},
	};
};
