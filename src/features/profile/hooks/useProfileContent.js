import { useState, useEffect } from 'react';
import { postService } from '@/features/posts';
import { likeService } from '@/features/likes';
import { bookmarkService } from '@/features/bookmarks/services/bookmark.service';

/**
 * Hook to manage user posts, liked posts, and saved posts based on tab selection.
 */
export const useProfileContent = (profileId, activeTab, isOwner) => {
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsFetchStatus, setPostsFetchStatus] = useState('idle');
  const [likesFetchStatus, setLikesFetchStatus] = useState('idle');
  const [savedFetchStatus, setSavedFetchStatus] = useState('idle');
  const [postsError, setPostsError] = useState('');
  const [likesError, setLikesError] = useState('');
  const [savedError, setSavedError] = useState('');

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

  // 3. Fetch user's saved posts (if owner)
  useEffect(() => {
    if (!profileId || activeTab !== 'saved' || !isOwner) return;

    let cancelled = false;
    const fetchSaved = async () => {
      setSavedFetchStatus('loading');
      try {
        const response = await bookmarkService.getBookmarkedPostsByUserId(profileId);
        const saved = response.documents || response;
        if (!cancelled) {
          setSavedPosts(saved || []);
          setSavedFetchStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          setSavedError(err?.message || 'Failed to load saved posts.');
          setSavedFetchStatus('error');
        }
      }
    };

    fetchSaved();
    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab, isOwner]);

  return {
    userPosts,
    likedPosts,
    savedPosts,
    postsLoading: postsFetchStatus === 'loading',
    isLoadingLikes: likesFetchStatus === 'loading',
    isSavedLoading: savedFetchStatus === 'loading',
    postsError,
    likesError,
    savedError,
  };
};
