import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAuthStatus, selectAuthUserId } from '@/features/auth';

const PrivateRoute = () => {
  const authStatus = useSelector(selectAuthStatus);
  const authUserId = useSelector(selectAuthUserId);

  const isAuthenticated = authStatus === 'authenticated' && !!authUserId;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
