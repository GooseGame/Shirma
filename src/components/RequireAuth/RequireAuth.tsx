import { Navigate } from 'react-router-dom';
import { loadState } from '../../store/storage';
import { USER_KEY, UserState } from '../../store/slices/User.slice';

export function RequireAuth({ children }: { children: React.ReactNode }) {
	const userInfo = loadState<UserState>(USER_KEY);
	console.log(userInfo);
	if (!userInfo || !userInfo.users.accessToken) {
		return <Navigate to='/auth' replace/>;
	}
	return children;
}