import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileService } from '@/services/profile';
import { selectAuthUserId } from '@/store/auth';
import { selectProfileById, setUserProfile } from '@/store/profile';

/**
 * Hook to fetch basic identity info for a user.
 * Supports resolving from username (URL) or direct userId.
 */
export const useProfile = ({ userId = null, username = null } = {}) => {
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);

  const targetId = userId || (!username ? authUserId : null);
  const [resolvedId, setResolvedId] = useState(targetId);
  const profile = useSelector((state) => selectProfileById(state, resolvedId));
  
  const [isLoading, setIsLoading] = useState(!profile);
  const [error, setError] = useState(null);

  const isOwner = useMemo(() => authUserId && resolvedId === authUserId, [authUserId, resolvedId]);

  useEffect(() => {
    let cancelled = false;

    const fetchProfileData = async () => {
      if (profile && resolvedId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let data = null;
        if (username && !resolvedId) {
          data = await profileService.getProfileByUsername(username);
          if (data && !cancelled) setResolvedId(data.$id);
        } else if (resolvedId) {
          data = await profileService.getProfile(resolvedId);
        }

        if (data && !cancelled) {
          dispatch(setUserProfile(data));
        } else if (!data && username && !cancelled) {
          setError('User not found');
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch profile');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProfileData();
    return () => { cancelled = true; };
  }, [userId, username, resolvedId, profile, dispatch]);

  return {
    profile,
    profileId: resolvedId,
    isOwner,
    isLoading,
    error,
    displayName: profile?.name || 'Anonymous',
    avatarUrl: profile?.avatarUrl,
    username: profile?.username,
    bio: profile?.bio,
  };
};
