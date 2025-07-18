import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, setLoading } from '../store/authSlice';
import { authService } from '../services/authService';

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      dispatch(setLoading(true));
      try {
        const user = await authService.getAccount();
        dispatch(setUser(user));
      } catch (error) {
        dispatch(clearUser());
        console.error('Auth Check Error:', error);
      } finally {
        dispatch(setLoading(false));
        setIsAuthChecked(true);
      }
    };
    checkUser();
  }, [dispatch]);

  return isAuthChecked;
};

export default useAuthCheck;
