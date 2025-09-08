import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PresetCharacter, PresetsResponse } from '../../interfaces/Character.interface';
import { loadState } from '../storage';
import axios, { AxiosError } from 'axios';
import { RootState } from '../store';
import { server } from './User.slice';

export const PRESETS_KEY = 'presets';

export interface PresetState {
	presets: PresetCharacter[],
	presetsCount: number,
	errMessage?: string
}

export interface PresetPersistentState {
	presets: PresetCharacter[]|null
}

const initialState: PresetState = {
	presets: loadState<PresetPersistentState>(PRESETS_KEY)?.presets ?? [],
	presetsCount: loadState<PresetPersistentState>(PRESETS_KEY)?.presets?.length ?? 0
};

export const load = createAsyncThunk<PresetsResponse, void, {state: RootState}>('presets/load', 
	async (_, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<PresetsResponse>(`${server}/presets/get`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return data;
	}
);

export const count = createAsyncThunk<PresetsResponse, void, {state: RootState}>('presets/count', 
	async (_, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<PresetsResponse>(`${server}/presets/count`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return data;
	}
);

export const save = createAsyncThunk('presets/save', 
	async (params: {character: PresetCharacter, accessToken: string}) => {
		try {
			const { data } = await axios.post<{success: boolean}>(`${server}/presets/save`, {
				character: params.character
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${params.accessToken}`
				}
			});
			return data;
		} catch(e) {
			if (e instanceof AxiosError) {
				throw new Error(e.response?.data.message);
			}
		}
	}
);

export const presetSlice = createSlice({
	name: 'presets',
	initialState,
	reducers: {
		addAll: (state, action: PayloadAction<PresetCharacter[]>) => {
			state.presets = action.payload;
			state.presetsCount = action.payload.length;
		},
		clear: (state) => {
			state.presets = [];
			state.presetsCount = 0;
		},
		clearErr: (state) => {
			state.errMessage = undefined;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(load.fulfilled, (state, action) => {
			state.presets = action.payload.presets;
			state.presetsCount = action.payload.presets.length;
		});
		builder.addCase(load.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
	}
});

export default presetSlice.reducer;
export const presetAction = presetSlice.actions;