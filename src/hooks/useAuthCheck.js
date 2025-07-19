import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setLoading } from '../store/authSlice';
import { authService } from '../services/authService';

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(status);

  useEffect(() => {
    const checkUser = async () => {
      dispatch(setLoading(true));
      try {
        const currentUser = await authService.getAccount();
        if (currentUser) {
          dispatch(setUser(currentUser));
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        dispatch(clearUser());
        console.error('Error checking user:', err);
      } finally {
        dispatch(setLoading(false));
        setIsAuthChecked(true);
      }
    };
    if (!status) {
      checkUser();
    } else {
      setIsAuthChecked(true);
    }
  }, [dispatch, status]);

  return isAuthChecked;
};

export default useAuthCheck;
