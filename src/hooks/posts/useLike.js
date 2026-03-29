import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { likeService } from '@/services/likes';
import { selectAuthUserId } from '@/store/auth';
import toast from 'react-hot-toast';

/**
 * Shared hook to manage post like state and interactions.
 * Features: Optimistic updates, auto-fetching status, and error handling.
 */
export const useLike = (post) => {
  const authUserId = useSelector(selectAuthUserId);
  
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikedLoading, setIsLikedLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  // Sync likesCount if the post prop updates (e.g., from a list refresh)
  useEffect(() => {
    if (post?.likesCount !== undefined) {
      setLikesCount(post.likesCount);
    }
  }, [post?.likesCount]);

  // Initial fetch: check if the user has already liked this post
  useEffect(() => {
    let cancelled = false;
    
    const checkLikeStatus = async () => {
      if (!authUserId || !post?.$id) {
        setIsLikedLoading(false);
        return;
      }

      try {
        const liked = await likeService.hasUserLiked(post.$id, authUserId);
        if (!cancelled) {
          setIsLiked(liked);
        }
      } catch (error) {
        console.error('useLike :: checkLikeStatus failed:', error);
      } finally {
        if (!cancelled) setIsLikedLoading(false);
      }
    };

    checkLikeStatus();
    return () => { cancelled = true; };
  }, [post?.$id, authUserId]);

  const toggleLike = useCallback(async (e) => {
    // Prevent event bubbling if used inside a clickable card
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();

    if (!authUserId) return toast.error('Please login to like posts');
    if (isLiking || isLikedLoading || !post?.$id) return;

    const wasLiked = isLiked;
    
    // 1. Optimistic Update (Immediate UI response)
    setIsLiking(true);
    setIsLiked(!wasLiked);
    setLikesCount(prev => Math.max(0, prev + (wasLiked ? -1 : 1)));

    try {
      // 2. Server Request
      if (wasLiked) {
        await likeService.unlikePost(post.$id, authUserId);
      } else {
        await likeService.likePost(post.$id, authUserId);
      }
    } catch (error) {
      // 3. Rollback on failure
      setIsLiked(wasLiked);
      setLikesCount(prev => Math.max(0, prev + (wasLiked ? 1 : -1)));
      toast.error('Could not update like. Please try again.');
      console.error('useLike :: toggleLike failed:', error);
    } finally {
      setIsLiking(false);
    }
  }, [authUserId, isLiking, isLikedLoading, post?.$id, isLiked]);

  return {
    likesCount,
    isLiked,
    isLikedLoading,
    isLiking,
    toggleLike,
    isAuthenticated: !!authUserId
  };
};
