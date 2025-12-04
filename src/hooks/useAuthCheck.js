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

const useAuthCheck = () => {
  const dispatch = useDispatch();

  const authStatus = useSelector(selectAuthStatus); // 'guest' | 'authenticated'
  const authUserId = useSelector(selectAuthUserId);

  // Check if we have the profile loaded in store
  const profile = useSelector((state) => selectProfileById(state, authUserId));
  const hasProfile = !!profile;

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const mountedRef = useRef(true);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      // Only set loading if we are not already authenticated (to avoid flicker)
      // or if we really need to show loading.
      if (authStatus !== 'authenticated') {
        dispatch(setAuthLoading(true));
      }

      try {
        let currentUserId = authUserId;

        // 1. If no user ID, fetch account from Appwrite
        if (!currentUserId) {
          const currentUser = await authService.getAccount();
          if (!mountedRef.current) return;

          if (currentUser) {
            currentUserId = currentUser.$id;
            dispatch(setAuthUserId(currentUserId));
          } else {
            dispatch(clearAuthUserId());
            // No user found, so we are guest. Stop here.
            return;
          }
        }

        // 2. We have a user ID (either from store or just fetched).
        // If profile is missing, fetch it.
        if (currentUserId && !hasProfile) {
          const profileDoc = await authService.getProfile(currentUserId);
          if (mountedRef.current && profileDoc) {
            dispatch(upsertProfile(profileDoc));
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        if (mountedRef.current) {
          // If strictly checking auth failed (401), clear user.
          // If profile fetch failed, we might still be logged in, just no profile.
          // For safety, if getAccount failed, we are guest.
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

    // Logic Matrix:
    // 1. Authenticated + Profile Loaded => OK
    // 2. Authenticated + Profile Missing => Run check (to fetch profile)
    // 3. Guest + Checked => OK
    // 4. Guest + Unchecked => Run check

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
