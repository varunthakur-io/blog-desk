import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setAuthUserId,
  clearAuthUserId,
  setAuthLoading,
  selectAuthStatus,
  selectAuthUserId,
} from '../store/authSlice';
import { upsertProfile, selectProfileById } from '../store/profileSlice';
import { authService } from '../services/authService';

/**
 * Custom hook to verify user authentication and profile status.
 *
 * This hook performs the following:
 * 1. Checks if a user session exists (via `authService.getAccount()`).
 * 2. Loads the user's profile if authenticated but missing in Redux state.
 * 3. Manages authentication loading state in Redux.
 *
 * @returns {boolean} isAuthChecked - True when the initial authentication check has completed.
 */
const useAuthCheck = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const authStatus = useSelector(selectAuthStatus); // 'guest' | 'authenticated'
  const authUserId = useSelector(selectAuthUserId);
  const profile = useSelector((state) => selectProfileById(state, authUserId));

  const hasProfile = !!profile;
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const mountedRef = useRef(true);

  // Track component mount status to prevent state updates on unmounted components
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      // Avoid UI flicker: only set loading if we aren't already authenticated
      // or if we haven't checked yet.
      if (authStatus !== 'authenticated') {
        dispatch(setAuthLoading(true));
      }

      try {
        let currentUserId = authUserId;

        // 1. If no user ID in store, try to fetch from Appwrite session
        if (!currentUserId) {
          const currentUser = await authService.getAccount();
          if (!mountedRef.current) return;

          if (currentUser) {
            currentUserId = currentUser.$id;
            dispatch(setAuthUserId(currentUserId));
          } else {
            // No session found -> User is Guest
            dispatch(clearAuthUserId());
            return;
          }
        }

        // 2. If we have a User ID but no Profile in store, fetch the profile
        if (currentUserId && !hasProfile) {
          const profileDoc = await authService.getProfile(currentUserId);
          if (mountedRef.current && profileDoc) {
            dispatch(upsertProfile(profileDoc));
          }
        }
      } catch (err) {
        console.error('useAuthCheck :: Error checking auth:', err);
        if (mountedRef.current) {
          // If authentication check fails (e.g., 401), assume guest
          if (!authUserId) {
            dispatch(clearAuthUserId());
          }
        }
      } finally {
        if (mountedRef.current) {
          dispatch(setAuthLoading(false));
          setIsAuthChecked(true);
        }
      }
    };

    // Optimization Logic:
    // 1. If Authenticated & Profile Loaded => Check Complete.
    if (authStatus === 'authenticated' && hasProfile) {
      if (!isAuthChecked) setIsAuthChecked(true);
      return;
    }

    // 2. If Guest & Check already ran => Stop.
    if (authStatus === 'guest' && isAuthChecked) {
      return;
    }

    // 3. Otherwise (Guest & Unchecked OR Authenticated & Missing Profile) => Run check.
    checkUser();
  }, [dispatch, authStatus, authUserId, hasProfile, isAuthChecked]);

  return isAuthChecked;
};

export default useAuthCheck;