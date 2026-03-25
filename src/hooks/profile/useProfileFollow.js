import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { followService } from '@/services/follows';
import { profileService } from '@/services/profile';
import { parseApiError } from '@/lib/error-handler';
import {
  selectFollowers,
  selectFollowing,
  setFollowers,
  setFollowing,
  setUserProfile,
} from '@/store/profile';

/**
 * Hook to manage following status, toggling follow, and fetching follow lists.
 */
export const useProfileFollow = (profileId, authUserId, activeTab, isOwner) => {
  const dispatch = useDispatch();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followFetchStatus, setFollowFetchStatus] = useState('idle');
  const [followActionStatus, setFollowActionStatus] = useState('idle');

  const [isFollowersLoading, setIsFollowersLoading] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  // Redux-based lists
  const followersProfiles = useSelector((state) => selectFollowers(state, profileId));
  const followingProfiles = useSelector((state) => selectFollowing(state, profileId));

  // 1. Check if current user follows this profile
  useEffect(() => {
    if (isOwner || !authUserId || !profileId) return;

    let cancelled = false;
    const checkStatus = async () => {
      setFollowFetchStatus('loading');
      try {
        const following = await followService.isFollowing(authUserId, profileId);
        if (!cancelled) {
          setIsFollowing(following);
          setFollowFetchStatus('success');
        }
      } catch {
        if (!cancelled) setFollowFetchStatus('error');
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [authUserId, profileId, isOwner]);

  // 2. Fetch Followers List
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

  // 4. Toggle Follow Action
  const handleToggleFollow = useCallback(async () => {
    if (!authUserId) {
      toast.error('Please login to follow users');
      return;
    }
    if (followActionStatus === 'loading') return;

    setFollowActionStatus('loading');
    const originalState = isFollowing;

    try {
      if (originalState) {
        await followService.unfollowUser(authUserId, profileId);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await followService.followUser(authUserId, profileId);
        setIsFollowing(true);
        toast.success('Following');
      }

      // Update counts in Redux store instantly (Soft-refresh)
      const updatedProfile = await profileService.getProfile(profileId);
      dispatch(setUserProfile(updatedProfile));

      setFollowActionStatus('success');
    } catch (err) {
      setFollowActionStatus('error');
      const message = parseApiError(err, `Failed to ${originalState ? 'unfollow' : 'follow'}`);
      toast.error(message);
    } finally {
      setFollowActionStatus('idle');
    }
  }, [authUserId, profileId, isFollowing, followActionStatus, dispatch]);

  return {
    isFollowing,
    isFollowLoading: followFetchStatus === 'loading' || followActionStatus === 'loading',
    isFollowersLoading,
    isFollowingLoading,
    followersProfiles,
    followingProfiles,
    handleToggleFollow,
  };
};
