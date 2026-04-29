import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isJwtExpired } from '../../helpers/jwt';
import { userActions } from '../../store/slices/User.slice';
import { AppDispatch, RootState } from '../../store/store';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
	const dispatch = useDispatch<AppDispatch>();
	const accessToken = useSelector((s: RootState) => s.user.users.accessToken);
	const role = useSelector((s: RootState) => s.user.users.role);
	const hasValidToken = Boolean(accessToken && !isJwtExpired(accessToken));
	const allowed = hasValidToken && role == 1;

	useEffect(() => {
		if (!hasValidToken) {
			dispatch(userActions.logout());
		}
	}, [hasValidToken, dispatch]);

	if (!allowed) {
		return <Navigate to='/characters' replace />;
	}

	return children;
}
