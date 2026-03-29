import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { followService } from '@/services/follows';
import { profileService } from '@/services/profile';
import { parseApiError } from '@/lib/error-handler';
import { useFollow } from './useFollow';
import {
  selectFollowers,
  selectFollowing,
  setFollowers,
  setFollowing,
} from '@/store/profile';

/**
 * Hook to manage followers and following lists for a profile.
 * Leverages useFollow for the relationship between the auth user and this profile.
 */
export const useProfileFollow = (profileId, authUserId, activeTab, isOwner) => {
  const dispatch = useDispatch();

  const {
    isFollowing,
    isLoading: isFollowLoading,
    toggleFollow,
  } = useFollow(profileId);

  const [isFollowersLoading, setIsFollowersLoading] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  // Redux-based lists
  const followersProfiles = useSelector((state) => selectFollowers(state, profileId));
  const followingProfiles = useSelector((state) => selectFollowing(state, profileId));

  // 1. Fetch Followers List
  useEffect(() => {
    if (!profileId || activeTab !== 'followers') return;

    let cancelled = false;
    const fetchFollowers = async () => {
      setIsFollowersLoading(true);
      try {
        const followers = await followService.getFollowers(profileId);
        const followerIds = followers.map((f) => f.followerId);

        if (followerIds.length > 0) {
          const profiles = await profileService.getProfilesByIds(followerIds);
          if (!cancelled) {
            dispatch(setFollowers({ userId: profileId, profiles }));
          }
        } else {
          if (!cancelled) dispatch(setFollowers({ userId: profileId, profiles: [] }));
        }
      } catch (err) {
        console.error('Failed to fetch followers:', err);
      } finally {
        if (!cancelled) setIsFollowersLoading(false);
      }
    };

    fetchFollowers();
    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab, dispatch]);

  // 3. Fetch Following List
  useEffect(() => {
    if (!profileId || activeTab !== 'following') return;

    let cancelled = false;
    const fetchFollowing = async () => {
      setIsFollowingLoading(true);
      try {
        const following = await followService.getFollowing(profileId);
        const followingIds = following.map((f) => f.followingId);

        if (followingIds.length > 0) {
          const profiles = await profileService.getProfilesByIds(followingIds);
          if (!cancelled) {
            dispatch(setFollowing({ userId: profileId, profiles }));
          }
        } else {
          if (!cancelled) dispatch(setFollowing({ userId: profileId, profiles: [] }));
        }
      } catch (err) {
        console.error('Failed to fetch following:', err);
      } finally {
        if (!cancelled) setIsFollowingLoading(false);
      }
    };

    fetchFollowing();
    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab, dispatch]);

  return {
    isFollowing,
    isFollowLoading,
    isFollowersLoading,
    isFollowingLoading,
    followersProfiles,
    followingProfiles,
    handleToggleFollow: toggleFollow,
  };
};
