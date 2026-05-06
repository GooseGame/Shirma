import axios, { AxiosError, AxiosHeaders } from 'axios';
import { store } from '../store/store';
import { userActions } from '../store/slices/User.slice';

let handling401 = false;

function requestHadBearerAuth(error: AxiosError): boolean {
	const headers = error.config?.headers;
	if (!headers) {
		return false;
	}
	let authz: string | undefined;
	if (headers instanceof AxiosHeaders) {
		const v = headers.get('Authorization');
		authz = v === false || v == null ? undefined : String(v);
	} else {
		const h = headers as Record<string, string | string[] | undefined>;
		const raw = h.Authorization ?? h.authorization;
		authz = Array.isArray(raw) ? raw[0] : raw;
	}
	return typeof authz === 'string' && authz.startsWith('Bearer ');
}

axios.interceptors.response.use(
	(r) => r,
	(error: AxiosError) => {
		const status = error.response?.status;
		const hadBearer = requestHadBearerAuth(error);

		if (status === 401 && hadBearer && !handling401) {
			handling401 = true;
			store.dispatch(userActions.logout());
			if (window.location.pathname !== '/auth') {
				window.location.assign('/auth');
			} else {
				handling401 = false;
			}
		}
		return Promise.reject(error);
	}
);
