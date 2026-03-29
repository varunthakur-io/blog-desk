import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@/features/posts';
import { profileService } from '@/features/profile';
import { debounce } from '@/lib/utils';
import {
  selectAllPosts,
  selectIsPostsLoading,
  selectPostsError,
  selectHasMore,
  selectPage,
  selectActiveCategory,
  selectFeedMode,
  setPostsStatus,
  setPostsError,
  setPostList,
  appendPostPage,
  setPostPagination,
  setActiveCategory,
  setFeedMode,
} from '@/features/posts';
import { setUserProfile } from '@/features/profile';
import { selectAuthUserId } from '@/features/auth';
import { POSTS_PER_PAGE } from '@/constants';

const LIMIT = POSTS_PER_PAGE;

export const useHome = () => {
  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);
  const isPostsLoading = useSelector(selectIsPostsLoading);
  const postsError = useSelector(selectPostsError);
  const hasMore = useSelector(selectHasMore);
  const page = useSelector(selectPage);
  const activeCategory = useSelector(selectActiveCategory);
  const feedMode = useSelector(selectFeedMode);
  const authUserId = useSelector(selectAuthUserId);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const loadingRef = useRef(false);

  // 1. Debounce logic for search input
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDebouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 500),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateDebouncedSearch(value);
  };

  const loadPage = useCallback(
    async (pageNum, category, search, mode) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      dispatch(setPostsStatus('loading'));
      try {
        let response;

        if (mode === 'following' && authUserId) {
          response = await postService.getFollowingFeed(authUserId, pageNum, LIMIT);
        } else {
          response = await postService.getAllPosts(pageNum, LIMIT, category, search);
        }

        const pagePosts = response.documents ?? [];

        // --- Senior Dev Move: Batch Prefetch Profiles ---
        if (pagePosts.length > 0) {
          const authorIds = [...new Set(pagePosts.map(p => p.authorId))].filter(Boolean);
          profileService.getProfilesByIds(authorIds)
            .then(profiles => {
              profiles.forEach(p => dispatch(setUserProfile(p)));
            })
            .catch(err => console.warn('Home Feed: Batch profile prefetch failed', err));
        }
        // -----------------------------------------------

        const totalFetched = (pageNum === 1 ? 0 : (pageNum - 1) * LIMIT) + pagePosts.length;

        if (pageNum === 1) {
          dispatch(setPostList(pagePosts));
        } else {
          dispatch(appendPostPage(pagePosts));
        }
        dispatch(setPostPagination({ page: pageNum, hasMore: totalFetched < response.total }));
      } catch (error) {
        dispatch(setPostsError(error?.message ?? 'Failed to fetch posts'));
      } finally {
        loadingRef.current = false;
      }
    },
    [dispatch, authUserId],
  );

  // 2. Reload when category, search, or feed mode changes
  useEffect(() => {
    loadPage(1, activeCategory, debouncedSearchTerm, feedMode);
  }, [activeCategory, debouncedSearchTerm, feedMode, loadPage]);

  // 3. Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      const { innerHeight } = window;
      const { scrollTop, offsetHeight } = document.documentElement;

      if (innerHeight + scrollTop >= offsetHeight - 200) {
        loadPage(page + 1, activeCategory, debouncedSearchTerm, feedMode);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, loadPage, debouncedSearchTerm, activeCategory, feedMode]);

  const handleCategoryChange = useCallback(
    (category) => {
      const next = category === activeCategory ? null : category;
      setSearchTerm('');
      setDebouncedSearchTerm('');
      dispatch(setActiveCategory(next));
    },
    [dispatch, activeCategory],
  );

  const handleFeedModeChange = useCallback(
    (mode) => {
      setSearchTerm('');
      setDebouncedSearchTerm('');
      dispatch(setFeedMode(mode));
    },
    [dispatch],
  );

  return {
    posts,
    postsLoading: isPostsLoading,
    postsError,
    hasMore,
    searchTerm,
    activeCategory,
    feedMode,
    authUserId,
    handleSearchChange,
    handleCategoryChange,
    handleFeedModeChange,
    LIMIT,
  };
};
