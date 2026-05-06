import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isJwtExpired } from '../../helpers/jwt';
import { loadState } from '../../store/storage';
import { USER_KEY, UserPersistentState, userActions } from '../../store/slices/User.slice';
import { AppDispatch } from '../../store/store';

export function RequireAuth({ children }: { children: React.ReactNode }) {
	const dispatch = useDispatch<AppDispatch>();
	const userInfo = loadState<UserPersistentState>(USER_KEY);
	const token = userInfo?.users?.accessToken ?? null;
	const allowed = Boolean(token && !isJwtExpired(token));

	useEffect(() => {
		if (!allowed) {
			dispatch(userActions.logout());
		}
	}, [allowed, dispatch]);

	if (!allowed) {
		return <Navigate to='/auth' replace />;
	}
	return children;
}