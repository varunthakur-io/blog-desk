import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setAuthStatus,
  setAuthUser,
  setAuthError,
  clearAuthUser,
  selectAuthStatus,
  selectAuthUserId,
} from '@/features/auth';
import { setUserProfile, selectProfileById } from '@/features/profile';
import { authService } from '@/features/auth';
import { profileService } from '@/features/profile';

export const useAuthCheck = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const authStatus = useSelector(selectAuthStatus);
  const authUserId = useSelector(selectAuthUserId);
  const profile = useSelector((state) => selectProfileById(state, authUserId));

  const hasProfile = !!profile;
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getAccount();
        if (!mountedRef.current) return;

        if (currentUser) {
          dispatch(setAuthUser(currentUser));
          
          const profileDoc = await profileService.getProfile(currentUser.$id);
          if (mountedRef.current && profileDoc) {
            dispatch(setUserProfile(profileDoc));
          }
        } else {
          dispatch(clearAuthUser());
        }
      } catch (error) {
        if (mountedRef.current) {
          dispatch(clearAuthUser()); 
        }
      } finally {
        if (mountedRef.current) {
          setIsAuthChecked(true);
        }
      }
    };

    if (authStatus === 'authenticated' && hasProfile) {
      setIsAuthChecked(true);
      return;
    }

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Stabilized dependency array

  return isAuthChecked;
};
