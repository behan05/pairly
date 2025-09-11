import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const isTokenAvailable = localStorage.getItem('token');

  const isLoggedIn = isAuthenticated || token || isTokenAvailable;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
