import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileService } from '@/features/profile';
import { selectAuthUserId } from '@/features/auth';
import { selectProfileById, setUserProfile } from '@/features/profile';

/**
 * Hook to fetch basic identity info for a user.
 * Supports resolving from username (URL) or direct userId.
 */
export const useProfileBasic = ({ userId = null, username = null } = {}) => {
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
      setIsLoading(true);
      setError(null);

      try {
        if (username) {
          if (profile?.username === username) return;

          const profileByUsername = await profileService.getProfileByUsername(username);
          if (cancelled) return;

          if (!profileByUsername) {
            setResolvedId(null);
            setError('User not found');
            return;
          }

          setResolvedId(profileByUsername.$id);
          dispatch(setUserProfile(profileByUsername));
          return;
        }

        if (!targetId) return;

        if (resolvedId !== targetId) {
          setResolvedId(targetId);
          return;
        }

        if (profile) return;

        const profileById = await profileService.getProfile(targetId);
        if (cancelled) return;

        if (profileById) {
          dispatch(setUserProfile(profileById));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch profile');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProfileData();
    return () => {
      cancelled = true;
    };
  }, [userId, username, targetId, resolvedId, profile, dispatch]);

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
