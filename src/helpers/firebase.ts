import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { PresetCharacter } from '../interfaces/Character.interface';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

export async function getAllPresets(): Promise<PresetCharacter[]> {
	const querySnapshot = await getDocs(collection(db, 'presets'));
	const presets: PresetCharacter[] = querySnapshot.docs.map(doc => (
		{...doc.data()['preset'] as PresetCharacter}));	
	return presets;
}