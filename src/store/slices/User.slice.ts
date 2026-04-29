import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginResponse, ProfileResponse } from '../../interfaces/User.interface';
import axios, { AxiosError } from 'axios';
import { RootState } from '../store';
import { loadState } from '../storage';

export const server = 'https://'+import.meta.env.VITE_SHIRMA_BACKEND;
export const USER_KEY = 'userData';

interface User {
	id: number;
	accessToken: string | null;
	refreshToken: string | null;
	name: string;
	email: string;
	loginErrorMessage?: string;
	profileErrorMessage?: string;
	otherErrorMessage?: string;
	profileLoaded: boolean;
	isNew:	boolean;
	role: number;
}

export interface UserState {
	users: User
}

export interface UserPersistentState {
    users: User|null
}

export const login = createAsyncThunk('user/login', 
	async (params: {googleToken: string}) => {
		try {
			const { data } = await axios.post<LoginResponse>(`${server}/login/google`, {
				googleToken: params.googleToken
			}, {
				headers: {
					'Content-Type': 'application/json'
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

export const profile = createAsyncThunk<ProfileResponse, void, {state: RootState}>('user/profile', 
	async (_, thunkApi) => {
		const accessToken = thunkApi.getState().user.users.accessToken;
		const { data } = await axios.get<ProfileResponse>(`${server}/user/get`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return data;
	}
);

export const name = createAsyncThunk('user/name', 
	async (params: {name: string, accessToken: string}) => {
		try {
			const { data } = await axios.post<{success: boolean}>(`${server}/user/changeName`, {
				name: params.name
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
			console.log(e);
		}
	}
);

const initialState: UserState = {
	users: loadState<UserPersistentState>(USER_KEY)?.users ?? {
		id: 0,
		accessToken: null,
		refreshToken: null,
		name: 'Пока неизвестно',
		email: 'Пока непонятно',
		profileLoaded: false,
		isNew: false,
		role: 0
	}
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			state.users.accessToken = null;
			state.users.refreshToken = null;
			state.users.isNew = false;
			state.users.role = 0;
		},
		clearErrors: (state) => {
			state.users.loginErrorMessage = undefined;
			state.users.profileErrorMessage = undefined;
			state.users.otherErrorMessage = undefined;
		},
		setOld: (state) => {
			state.users.isNew = false;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(login.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.users.accessToken = action.payload.accessToken;
			state.users.refreshToken = action.payload.refreshToken;
			state.users.isNew = action.payload.isNew;
		});
		builder.addCase(login.rejected, (state, action) => {
			state.users.loginErrorMessage = action.error.message;
		});
		builder.addCase(profile.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.users.name = action.payload.name;
			state.users.email = action.payload.email;
			state.users.id = action.payload.id;
			state.users.profileLoaded = true;
			state.users.role = action.payload.role;
		});
		builder.addCase(profile.rejected, (state, action) => {
			state.users.profileErrorMessage = action.error.message;
			state.users.profileLoaded = true;
		});
		builder.addCase(profile.pending, (state) => {
			state.users.name = 'Загружаем имя...';
			state.users.email = 'Загружаем почту...';
			state.users.role = 0;
		});
		builder.addCase(name.rejected, (state, action) => {
			state.users.otherErrorMessage = action.error.message;
		});
		builder.addCase(name.fulfilled, (state, action)=> {
			state.users.name = action.meta.arg.name;
			console.log('name saved');
		});
	}
});

export default userSlice.reducer;
export const userActions = userSlice.actions;