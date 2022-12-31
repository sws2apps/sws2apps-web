import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isAdmin }) {
  return isAdmin ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivateRoute;
