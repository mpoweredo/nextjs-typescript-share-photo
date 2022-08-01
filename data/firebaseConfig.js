// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyC-KZTEa6o_Al07cPjkvlsoojlEAyWJBSo",
	authDomain: "drag-drop-image.firebaseapp.com",
	projectId: "drag-drop-image",
	storageBucket: "drag-drop-image.appspot.com",
	messagingSenderId: "49992694282",
	appId: "1:49992694282:web:ab73142388116f175b3df3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
export { app, db, storage };
