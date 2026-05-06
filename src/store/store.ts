import { configureStore } from '@reduxjs/toolkit';
import charsSlice, { CHAR_KEY } from './slices/Characters.slice';
import { saveState } from './storage';
import presetSlice, { PRESETS_KEY } from './slices/Presets.slice';
import userSlice, { USER_KEY} from './slices/User.slice';
import monstersSlice, { MONSTERS_KEY } from './slices/Monsters.slice';

export const store = configureStore({
	reducer: {
		characters: charsSlice,
		presets: presetSlice,
		user: userSlice,
		monsters: monstersSlice
	}
});

store.subscribe(()=>{
	saveState(
		{
			characters: store.getState().characters.characters.filter((character) => !character.isPresetDraft), 
			errMessage: store.getState().characters.errMessage,
			needToUpdate: store.getState().characters.needToUpdate,
			lastUpdateTimestamp: store.getState().characters.lastUpdateTimestamp
		}, CHAR_KEY);
	saveState(
		{
			presets: store.getState().presets.presets,
			errMessage: store.getState().presets.errMessage,
			presetsCount: store.getState().presets.presetsCount,
			lastUpdateTimestamp: store.getState().presets.lastUpdateTimestamp
		}, PRESETS_KEY);
	saveState({users: store.getState().user.users}, USER_KEY);
	saveState({ drafts: store.getState().monsters.drafts }, MONSTERS_KEY);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;