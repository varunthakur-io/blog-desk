import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { followService } from '@/services/follows';
import { profileService } from '@/services/profile';
import { selectAuthUserId } from '@/store/auth';
import { setUserProfile } from '@/store/profile';

/**
 * Standalone hook to manage follow status between the current user and a target profile.
 * Features: Optimistic updates, auto-status check, and profile count syncing.
 */
export const useFollow = (targetProfileId) => {
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);

  const isOwner = authUserId === targetProfileId;

  // 1. Initial Status Check
  useEffect(() => {
    if (isOwner || !authUserId || !targetProfileId) {
      setIsStatusLoading(false);
      return;
    }

    let cancelled = false;
    const checkStatus = async () => {
      setIsStatusLoading(true);
      try {
        const following = await followService.isFollowing(authUserId, targetProfileId);
        if (!cancelled) {
          setIsFollowing(following);
        }
      } catch (error) {
        console.error('useFollow :: status check failed:', error);
      } finally {
        if (!cancelled) setIsStatusLoading(false);
      }
    };

    checkStatus();
    return () => { cancelled = true; };
  }, [authUserId, targetProfileId, isOwner]);

  // 2. Toggle Follow Action
  const toggleFollow = useCallback(async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();

    if (!authUserId) return toast.error('Please login to follow authors');
    if (isOwner) return toast.error("You can't follow yourself");
    if (isLoading || isStatusLoading) return;

    const wasFollowing = isFollowing;
    setIsLoading(true);
    
    // Optimistic Update
    setIsFollowing(!wasFollowing);

    try {
      if (wasFollowing) {
        await followService.unfollowUser(authUserId, targetProfileId);
        toast.success('Unfollowed');
      } else {
        await followService.followUser(authUserId, targetProfileId);
        toast.success('Following');
      }

      // Sync the target profile's counts (followersCount, etc.) in Redux
      const updatedProfile = await profileService.getProfile(targetProfileId);
      dispatch(setUserProfile(updatedProfile));
      
    } catch (error) {
      // Rollback on failure
      setIsFollowing(wasFollowing);
      toast.error(error.message || 'Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  }, [authUserId, targetProfileId, isFollowing, isLoading, isStatusLoading, isOwner, dispatch]);

  return {
    isFollowing,
    isLoading: isLoading || isStatusLoading,
    isStatusLoading,
    toggleFollow,
    isOwner,
    isAuthenticated: !!authUserId
  };
};
