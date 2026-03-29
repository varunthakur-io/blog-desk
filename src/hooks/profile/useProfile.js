import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileService } from '@/services/profile';
import { selectProfileById, setUserProfile } from '@/store/profile';

/**
 * Universal hook to fetch and manage a user's profile identity.
 * Leverages Redux cache to avoid redundant network requests.
 */
export const useProfile = (userId) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => selectProfileById(state, userId));
  
  const [isLoading, setIsLoading] = useState(!profile);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have the profile in Redux, don't fetch again
    if (profile || !userId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await profileService.getProfile(userId);
        if (!cancelled) {
          dispatch(setUserProfile(data));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch profile');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProfile();
    return () => { cancelled = true; };
  }, [userId, profile, dispatch]);

  return {
    profile,
    isLoading,
    error,
    displayName: profile?.name || 'Anonymous',
    avatarUrl: profile?.avatarUrl,
    username: profile?.username,
    bio: profile?.bio,
  };
};
