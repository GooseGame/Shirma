import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PresetCharacter } from '../../interfaces/Character.interface';
import { loadState } from '../storage';

export const PRESETS_KEY = 'presets';

export interface PresetState {
	presets: PresetCharacter[]
}

export interface PresetPersistentState {
	presets: PresetCharacter[]|null
}

const initialState: PresetState = {
	presets: loadState<PresetPersistentState>(PRESETS_KEY)?.presets ?? []
};

export const presetSlice = createSlice({
	name: 'presets',
	initialState,
	reducers: {
		addAll: (state, action: PayloadAction<PresetCharacter[]>) => {
			state.presets = action.payload;
		},
		clear: (state) => {
			state.presets = [];
		}
	}
});

export default presetSlice.reducer;
export const presetAction = presetSlice.actions;