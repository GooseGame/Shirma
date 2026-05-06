import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../store';
import { server } from './User.slice';
import { loadState } from '../storage';
import { Monster, MonsterSimplyfied } from '../../interfaces/Monster.interface';

export const MONSTERS_KEY = 'monsters';

type MonsterSource = 'local' | 'global';

interface MonstersResponse {
	monsters: MonsterSimplyfied[];
}

interface MonsterResponse {
	monster?: Monster;
}

function looksLikeMonster(value: unknown): value is Monster {
	if (!value || typeof value !== 'object') {
		return false;
	}
	const candidate = value as Partial<Monster>;
	return typeof candidate.id === 'string' && typeof candidate.name === 'string';
}

function csvToArray(value: string[] | string | undefined): string[] {
	if (Array.isArray(value)) {
		return value;
	}
	if (!value) {
		return [];
	}
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

function arrayToCsv(value: string[] | string | undefined): string {
	if (Array.isArray(value)) {
		return value.join(', ');
	}
	return value ?? '';
}

function normalizeMonsterPreview(monster: Record<string, unknown>): MonsterSimplyfied {
	const id = String(monster.id ?? '');
	const name = String(monster.name ?? '');
	const avatar = String(monster.avatar ?? '');
	const typeName = String(monster.typeName ?? monster.type_name ?? '');
	const alignmentShort = String(monster.alignmentShort ?? monster.alignment_short ?? '');
	const challengeRating =
		typeof monster.challengeRating === 'number'
			? monster.challengeRating
			: typeof monster.challenge_rating === 'number'
				? monster.challenge_rating
				: Number(monster.challengeRating ?? monster.challenge_rating) || 0;
	const livingAreasRaw = (monster.livingAreas ?? monster.living_areas) as string[] | string | undefined;
	const sizeNamesRaw = (monster.sizeNames ?? monster.size_names) as string[] | string | undefined;
	return {
		id,
		name,
		avatar,
		challengeRating,
		typeName,
		livingAreas: csvToArray(livingAreasRaw),
		sizeNames: csvToArray(sizeNamesRaw),
		alignmentShort
	};
}

export interface MonstersPersistentState {
	drafts?: Monster[];
}

export interface MonstersState {
	localMonsters: MonsterSimplyfied[];
	globalMonsters: MonsterSimplyfied[];
	drafts: Monster[];
	errMessage?: string;
}

const persisted = loadState<MonstersPersistentState>(MONSTERS_KEY);

const initialState: MonstersState = {
	localMonsters: [],
	globalMonsters: [],
	drafts: persisted?.drafts ?? []
};

export const loadMonstersBy = createAsyncThunk<MonstersResponse, { by: MonsterSource }, { state: RootState }>(
	'monsters/loadBy',
	async ({ by }, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<MonstersResponse>(`${server}/monsters/get`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			params: { by }
		});
		return data;
	}
);

export const getMonsterById = createAsyncThunk<Monster | null, { id: string }, { state: RootState }>(
	'monsters/getById',
	async ({ id }, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<MonsterResponse | Monster>(`${server}/monsters/get`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			params: { id }
		});
		if (looksLikeMonster(data)) {
			return data;
		}
		if (looksLikeMonster((data as MonsterResponse).monster)) {
			return (data as MonsterResponse).monster as Monster;
		}
		return null;
	}
);

export const saveMonster = createAsyncThunk<{ success: boolean }, { monster: Monster; monster_preview: MonsterSimplyfied; accessToken: string }>(
	'monsters/save',
	async ({ monster, monster_preview, accessToken }) => {
		try {
			const previewPayload = {
				...monster_preview,
				livingAreas: arrayToCsv(monster_preview.livingAreas),
				sizeNames: arrayToCsv(monster_preview.sizeNames)
			};
			const { data } = await axios.post<{ success: boolean }>(
				`${server}/monsters/save`,
				{ monster, monster_preview: previewPayload, id: monster_preview.id },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					}
				}
			);
			return data;
		} catch (e) {
			if (e instanceof AxiosError) {
				throw new Error(e.response?.data.message);
			}
			throw e;
		}
	}
);

export const deleteMonster = createAsyncThunk<{ success: boolean }, { id: string; accessToken: string }>(
	'monsters/delete',
	async ({ id, accessToken }) => {
		try {
			const { data } = await axios.post<{ success: boolean }>(
				`${server}/monsters/delete`,
				{ id },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					}
				}
			);
			return data;
		} catch (e) {
			if (e instanceof AxiosError) {
				throw new Error(e.response?.data.message);
			}
			throw e;
		}
	}
);

const monstersSlice = createSlice({
	name: 'monsters',
	initialState,
	reducers: {
		clearErr: (state) => {
			state.errMessage = undefined;
		},
		upsertDraft: (state, action: PayloadAction<Monster>) => {
			const idx = state.drafts.findIndex((monster) => monster.id === action.payload.id);
			if (idx >= 0) {
				state.drafts[idx] = action.payload;
				return;
			}
			state.drafts.push(action.payload);
		},
		removeDraft: (state, action: PayloadAction<string>) => {
			state.drafts = state.drafts.filter((monster) => monster.id !== action.payload);
		},
		setName: (state, action: PayloadAction<{ id: string; name: string }>) => {
			state.drafts = state.drafts.map((monster) =>
				monster.id === action.payload.id ? { ...monster, name: action.payload.name } : monster
			);
		},
		setAvatar: (state, action: PayloadAction<{ id: string; avatar: string }>) => {
			state.drafts = state.drafts.map((monster) =>
				monster.id === action.payload.id ? { ...monster, avatar: action.payload.avatar } : monster
			);
		},
		setChallengeRating: (state, action: PayloadAction<{ id: string; challengeRating: number }>) => {
			state.drafts = state.drafts.map((monster) =>
				monster.id === action.payload.id
					? {
						...monster,
						danger: {
							...monster.danger,
							challengeRating: action.payload.challengeRating
						}
					}
					: monster
			);
		}
	},
	extraReducers: (builder) => {
		builder.addCase(loadMonstersBy.fulfilled, (state, action) => {
			const normalizedMonsters = (action.payload.monsters ?? []).map((monster) =>
				normalizeMonsterPreview(monster as unknown as Record<string, unknown>)
			);
			const by = action.meta.arg.by;
			if (by === 'local') {
				state.localMonsters = normalizedMonsters;
				return;
			}
			state.globalMonsters = normalizedMonsters;
		});
		builder.addCase(loadMonstersBy.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
		builder.addCase(getMonsterById.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			const idx = state.drafts.findIndex((monster) => monster.id === action.payload?.id);
			if (idx >= 0) {
				state.drafts[idx] = action.payload;
				return;
			}
			state.drafts.push(action.payload);
		});
		builder.addCase(getMonsterById.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
		builder.addCase(saveMonster.fulfilled, (state, action) => {
			const savedMonsterId = action.meta.arg.monster.id;
			state.drafts = state.drafts.filter((monster) => monster.id !== savedMonsterId);
		});
		builder.addCase(saveMonster.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
		builder.addCase(deleteMonster.fulfilled, (state, action) => {
			const deletedId = action.meta.arg.id;
			state.drafts = state.drafts.filter((monster) => monster.id !== deletedId);
			state.localMonsters = state.localMonsters.filter((monster) => monster.id !== deletedId);
			state.globalMonsters = state.globalMonsters.filter((monster) => monster.id !== deletedId);
		});
		builder.addCase(deleteMonster.rejected, (state, action) => {
			state.errMessage = action.error.message;
		});
	}
});

export default monstersSlice.reducer;
export const monstersActions = monstersSlice.actions;
