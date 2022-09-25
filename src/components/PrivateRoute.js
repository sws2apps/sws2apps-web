import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isAdmin, isMfaVerified }) {
	return isAdmin && isMfaVerified ? <Outlet /> : <Navigate to='/' />;
}

export default PrivateRoute;
