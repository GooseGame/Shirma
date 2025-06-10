import { configureStore } from '@reduxjs/toolkit';
import charsSlice, { CHAR_KEY } from './slices/Characters.slice';
import { saveState } from './storage';
import presetSlice, { PRESETS_KEY } from './slices/Presets.slice';

export const store = configureStore({
	reducer: {
		characters: charsSlice,
		presets: presetSlice
	}
});

store.subscribe(()=>{
	saveState({characters: store.getState().characters.characters}, CHAR_KEY);
	saveState({presets: store.getState().presets.presets}, PRESETS_KEY);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;