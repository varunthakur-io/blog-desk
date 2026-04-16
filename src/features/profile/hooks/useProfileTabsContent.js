import { useState, useEffect } from 'react';
import { postService } from '@/features/posts';
import { likeService } from '@/features/likes';
import { bookmarkService } from '@/features/bookmarks/services/bookmark.service';

const toDocuments = (response) => response?.documents || response || [];

const fetchContent = async ({
  setStatus,
  setError,
  request,
  onSuccess,
  fallbackError,
  isCancelled,
}) => {
  setStatus('loading');
  setError('');

  try {
    const response = await request();
    if (isCancelled()) return;

    onSuccess(toDocuments(response));
    setStatus('success');
  } catch (err) {
    if (isCancelled()) return;

    setError(err?.message || fallbackError);
    setStatus('error');
  }
};

/**
 * Hook to manage user posts, liked posts, and saved posts based on tab selection.
 */
export const useProfileTabsContent = (profileId, activeTab, isOwner) => {
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsFetchStatus, setPostsFetchStatus] = useState('idle');
  const [likesFetchStatus, setLikesFetchStatus] = useState('idle');
  const [savedFetchStatus, setSavedFetchStatus] = useState('idle');
  const [postsError, setPostsError] = useState('');
  const [likesError, setLikesError] = useState('');
  const [savedError, setSavedError] = useState('');

  useEffect(() => {
    if (!profileId || activeTab !== 'posts') return;

    let cancelled = false;
    fetchContent({
      setStatus: setPostsFetchStatus,
      setError: setPostsError,
      request: () => postService.getPostsByUserId(profileId, 1, 50),
      onSuccess: setUserPosts,
      fallbackError: 'Failed to load posts.',
      isCancelled: () => cancelled,
    });

    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab]);

  useEffect(() => {
    if (!profileId || activeTab !== 'likes' || !isOwner) return;

    let cancelled = false;
    fetchContent({
      setStatus: setLikesFetchStatus,
      setError: setLikesError,
      request: () => likeService.getLikedPostsByUserId(profileId),
      onSuccess: setLikedPosts,
      fallbackError: 'Failed to load likes.',
      isCancelled: () => cancelled,
    });

    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab, isOwner]);

  useEffect(() => {
    if (!profileId || activeTab !== 'saved' || !isOwner) return;

    let cancelled = false;
    fetchContent({
      setStatus: setSavedFetchStatus,
      setError: setSavedError,
      request: () => bookmarkService.getBookmarkedPostsByUserId(profileId),
      onSuccess: setSavedPosts,
      fallbackError: 'Failed to load saved posts.',
      isCancelled: () => cancelled,
    });

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
