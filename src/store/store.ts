import { configureStore } from '@reduxjs/toolkit';
import charsSlice, { CHAR_KEY } from './slices/Characters.slice';
import { saveState } from './storage';

export const store = configureStore({
	reducer: {
		characters: charsSlice
	}
});

store.subscribe(()=>{
	saveState({characters: store.getState().characters.characters}, CHAR_KEY);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;