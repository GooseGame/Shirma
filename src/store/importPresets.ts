import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import presets from './presets.json' assert { type: 'json' };
import {fbApp} from '../helpers/firebase.ts';

const db = getFirestore(fbApp);

// export async function importPresets() {
// 	try {
// 		const colRef = collection(db, 'presets');

// 		for (const preset of presets.presets) {
// 			await addDoc(colRef, preset);
// 			console.log('✅ Preset added.');
// 		}

// 		console.log('🎉 All presets imported.');
// 	} catch (err) {
// 		console.error('❌ Import failed:', err);
// 	}
// }

export async function getAllPresets() {
	const querySnapshot = await getDocs(collection(db, 'presets'));
	const presets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	return presets;
}