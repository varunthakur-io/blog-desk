// src/components/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);
  console.log('PrivateRoute check - user:', user); // Debug log

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
