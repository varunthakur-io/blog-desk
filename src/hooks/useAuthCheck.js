import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// authSlice actions and services
import { setUser, clearUser, setLoading } from '../store/authSlice';
import { authService } from '../services/authService';

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth.status);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    // track mounted state to avoid updating after unmount
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      dispatch(setLoading(true));
      try {
        const currentUser = await authService.getAccount();
        if (!mountedRef.current) return; // bail out if unmounted
        if (currentUser) {
          dispatch(setUser(currentUser));
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        if (mountedRef.current) {
          dispatch(clearUser());
          console.error('Error checking user:', err);
        }
      } finally {
        if (mountedRef.current) {
          dispatch(setLoading(false));
          setIsAuthChecked(true);
        }
      }
    };

    // fast path: if status already truthy, mark checked immediately
    if (status) {
      setIsAuthChecked(true);
      return;
    }

    checkUser();
  }, [dispatch, status]);

  return isAuthChecked;
};

export default useAuthCheck;
