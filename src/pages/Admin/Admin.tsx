import { RequireAdmin } from '../../components/RequireAdmin/RequireAdmin';
import { Navigate } from 'react-router-dom';

export function Admin() {
	return <RequireAdmin>
		<Navigate to='/presets' replace />
	</RequireAdmin>;
}
