import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextApiRequest, NextApiResponse } from 'next';
import { db, storage } from '../../data/firebaseConfig';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') return;

	const { title, selectedFile } = req.body;

    console.log(selectedFile)

	try {
		const uploadPhoto = await addDoc(collection(db, 'photos'), {
			title,
			createdAt: serverTimestamp(),
		});

		const imgRef = await ref(storage, `photos/${uploadPhoto.id}/${selectedFile.path}`);
		uploadBytes(imgRef, selectedFile, 'data_url').then(async () => {
			const downloadURL = await getDownloadURL(imgRef);
			await updateDoc(doc(db, 'photos', uploadPhoto.id), {
				image: downloadURL,
			});
		});

        res.status(200).json({message: uploadPhoto.id})
	} catch (error: any) {
        res.status(422).json({message: error.message})
    }
};

export default handler;
