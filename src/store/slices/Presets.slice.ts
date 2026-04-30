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
	errMessage?: string,
	lastUpdateTimestamp?: number
}

export interface PresetPersistentState {
	presets: PresetCharacter[]|null
	lastUpdateTimestamp?: number
}

interface PresetsLastUpdatedResponse {
	lastUpdatedTimestamp?: number
}

const initialState: PresetState = {
	presets: loadState<PresetPersistentState>(PRESETS_KEY)?.presets ?? [],
	presetsCount: loadState<PresetPersistentState>(PRESETS_KEY)?.presets?.length ?? 0,
	lastUpdateTimestamp: loadState<PresetPersistentState>(PRESETS_KEY)?.lastUpdateTimestamp ?? 0
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

export const timestamp = createAsyncThunk<number, void, {state: RootState}>('presets/timestamp',
	async (_, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<PresetsLastUpdatedResponse>(`${server}/presets/lastUpdated`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return Number(data?.lastUpdatedTimestamp) || 0;
	}
);

export const loadIfNeeded = createAsyncThunk<void, void, {state: RootState}>('presets/loadIfNeeded',
	async (_, thunkApi) => {
		const { presets, lastUpdateTimestamp } = thunkApi.getState().presets;
		const localTimestamp = lastUpdateTimestamp ?? 0;
		const hasLocalPresets = presets.length > 0;
		const serverTimestamp = await thunkApi.dispatch(timestamp()).unwrap();
		if (!hasLocalPresets || localTimestamp < serverTimestamp) {
			await thunkApi.dispatch(load()).unwrap();
		}
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
	async (params: {character: PresetCharacter, accessToken: string, presetId: string}) => {
		try {
			const { data } = await axios.post<{success: boolean}>(`${server}/presets/save`, {
				character: params.character,
				presetId: params.presetId
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

export const deletePreset = createAsyncThunk('presets/delete',
	async (params: { presetId: string, accessToken: string }) => {
		try {
			const { data } = await axios.post<{success: boolean}>(`${server}/presets/delete`, {
				presetId: params.presetId
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${params.accessToken}`
				}
			});
			return data;
		} catch (e) {
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
		upsertOne: (state, action: PayloadAction<PresetCharacter>) => {
			const idx = state.presets.findIndex((preset) => preset.presetId === action.payload.presetId);
			if (idx >= 0) {
				state.presets[idx] = action.payload;
				return;
			}
			state.presets.push(action.payload);
			state.presetsCount = state.presets.length;
		},
		removeOne: (state, action: PayloadAction<string>) => {
			state.presets = state.presets.filter((preset) => preset.presetId !== action.payload);
			state.presetsCount = state.presets.length;
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
		builder.addCase(timestamp.fulfilled, (state, action) => {
			state.lastUpdateTimestamp = action.payload;
		});
		builder.addCase(load.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
		builder.addCase(save.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
		builder.addCase(deletePreset.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
	}
});

export default presetSlice.reducer;
export const presetAction = presetSlice.actions;