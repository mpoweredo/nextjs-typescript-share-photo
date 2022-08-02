import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../data/firebaseConfig';
import { PhotoData } from '../../types/types';
import { formatDate } from '../../helpers/convertDate';

type Props = {
	photoData: PhotoData;
};

const PhotoPage: NextPage<Props> = ({ photoData }) => {


    const convertedDate = formatDate(photoData.createdAt)

	return <div>
        <h1>{photoData.title}</h1>
        <img src={photoData.image} alt="" />
        <h1>{convertedDate}</h1>
    </div>;
};

export default PhotoPage;

export const getServerSideProps: GetServerSideProps = async context => {
	const photoId = context.query.photoId as string
    
	const docRef = doc(db, 'photos', photoId);
	const docSnap = await getDoc(docRef);

    const fetchedData = docSnap.data()

    const photoData: PhotoData = {
        title: fetchedData!.title,
        image: fetchedData!.image,
        createdAt: fetchedData!.createdAt.toDate()
    }

	return {
		props: {
			photoData: JSON.parse(JSON.stringify(photoData))
		},
	};
};
