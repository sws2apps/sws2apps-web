import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isAdmin }) {
	return isAdmin ? <Outlet /> : <Navigate to='/' />;
}

export default PrivateRoute;
