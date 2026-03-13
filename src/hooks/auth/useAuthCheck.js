import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setAuthStatus,
  setAuthUser,
  setAuthError,
  clearAuthUser,
  selectAuthStatus,
  selectAuthUserId,
} from '../../store/auth';
import { setUserProfile, selectProfileById } from '../../store/profile';
import { authService } from '../../services/auth';
import { profileService } from '../../services/profile';

const useAuthCheck = () => {
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
      // Avoid flicker if already authenticated
      if (authStatus !== 'authenticated') {
        dispatch(setAuthStatus('loading'));
      }

      try {
        let currentUserData = null;

        // 1. Fetch from Appwrite session
        const currentUser = await authService.getAccount();
        if (!mountedRef.current) return;

        if (currentUser) {
          currentUserData = currentUser;
          dispatch(setAuthUser(currentUser));
        } else {
          dispatch(clearAuthUser());
          return;
        }

        // 2. Fetch profile if missing
        if (currentUserData && !hasProfile) {
          const profileDoc = await profileService.getProfile(currentUserData.$id);
          if (mountedRef.current && profileDoc) {
            dispatch(setUserProfile(profileDoc));
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          dispatch(setAuthError(err?.message));
        }
      } finally {
        if (mountedRef.current) {
          setIsAuthChecked(true);
        }
      }
    };

    // Optimization: Skip check if data is already in store
    if (authStatus === 'authenticated' && hasProfile) {
      if (!isAuthChecked) setIsAuthChecked(true);
      return;
    }

    if (authStatus === 'guest' && isAuthChecked) {
      return;
    }

    checkUser();
  }, [dispatch, authStatus, authUserId, hasProfile, isAuthChecked]);

  return isAuthChecked;
};

export default useAuthCheck;
