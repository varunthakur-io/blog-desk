import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followService } from '@/features/follows';
import { profileService } from '@/features/profile';
import { selectFollowers, selectFollowing, setFollowers, setFollowing } from '@/features/profile';

/**
 * Hook to manage followers and following lists for a profile.
 * Optimized to fetch only when requested.
 */
export const useProfileConnections = (profileId) => {
  const dispatch = useDispatch();

  const [isFollowersLoading, setIsFollowersLoading] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  // Redux-based lists
  const followersProfiles = useSelector((state) => selectFollowers(state, profileId));
  const followingProfiles = useSelector((state) => selectFollowing(state, profileId));

  const fetchFollowers = useCallback(async () => {
    if (!profileId || followersProfiles.length > 0) return;

    setIsFollowersLoading(true);
    try {
      const followers = await followService.getFollowers(profileId);
      const followerIds = followers.map((f) => f.followerId);

      if (followerIds.length > 0) {
        const profiles = await profileService.getProfilesByIds(followerIds);
        dispatch(setFollowers({ userId: profileId, profiles }));
      } else {
        dispatch(setFollowers({ userId: profileId, profiles: [] }));
      }
    } catch (err) {
      console.error('Failed to fetch followers:', err);
    } finally {
      setIsFollowersLoading(false);
    }
  }, [profileId, followersProfiles.length, dispatch]);

  const fetchFollowing = useCallback(async () => {
    if (!profileId || followingProfiles.length > 0) return;

    setIsFollowingLoading(true);
    try {
      const following = await followService.getFollowing(profileId);
      const followingIds = following.map((f) => f.followingId);

      if (followingIds.length > 0) {
        const profiles = await profileService.getProfilesByIds(followingIds);
        dispatch(setFollowing({ userId: profileId, profiles }));
      } else {
        dispatch(setFollowing({ userId: profileId, profiles: [] }));
      }
    } catch (err) {
      console.error('Failed to fetch following:', err);
    } finally {
      setIsFollowingLoading(false);
    }
  }, [profileId, followingProfiles.length, dispatch]);

  return {
    isFollowersLoading,
    isFollowingLoading,
    followersProfiles,
    followingProfiles,
    fetchFollowers,
    fetchFollowing,
  };
};
