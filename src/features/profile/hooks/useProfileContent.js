import { useState, useEffect } from 'react';
import { postService } from '@/features/posts';
import { likeService } from '@/features/likes';

/**
 * Hook to manage user posts and liked posts based on tab selection.
 */
export const useProfileContent = (profileId, activeTab, isOwner) => {
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [postsFetchStatus, setPostsFetchStatus] = useState('idle');
  const [likesFetchStatus, setLikesFetchStatus] = useState('idle');
  const [postsError, setPostsError] = useState('');
  const [likesError, setLikesError] = useState('');

  // 1. Fetch user's own posts
  useEffect(() => {
    if (!profileId || activeTab !== 'posts') return;

    let cancelled = false;
    const fetchPosts = async () => {
      setPostsFetchStatus('loading');
      try {
        const posts = await postService.getPostsByUserId(profileId, 1, 50);
        if (!cancelled) {
          setUserPosts(posts.documents || []);
          setPostsFetchStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          setPostsError(err?.message || 'Failed to load posts.');
          setPostsFetchStatus('error');
        }
      }
    };

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab]);

  // 2. Fetch user's liked posts (if owner)
  useEffect(() => {
    if (!profileId || activeTab !== 'likes' || !isOwner) return;

    let cancelled = false;
    const fetchLiked = async () => {
      setLikesFetchStatus('loading');
      try {
        const response = await likeService.getLikedPostsByUserId(profileId);
        // Extract documents from response if it's an Appwrite response object
        const liked = response.documents || response;
        if (!cancelled) {
          setLikedPosts(liked || []);
          setLikesFetchStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          setLikesError(err?.message || 'Failed to load likes.');
          setLikesFetchStatus('error');
        }
      }
    };

    fetchLiked();
    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab, isOwner]);

  return {
    userPosts,
    likedPosts,
    postsLoading: postsFetchStatus === 'loading',
    isLoadingLikes: likesFetchStatus === 'loading',
    postsError,
    likesError,
  };
};
