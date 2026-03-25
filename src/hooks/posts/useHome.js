import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@/services/posts';
import { debounce } from '@/lib/utils';
import {
  selectAllPosts,
  selectIsPostsLoading,
  selectPostsError,
  selectHasMore,
  selectPage,
  selectActiveCategory,
  setPostsStatus,
  setPostsError,
  setPostList,
  appendPostPage,
  setPostPagination,
  setActiveCategory,
} from '@/store/posts';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Ref to track loading state without triggering re-renders or effect loops
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
    async (pageNum, category, search) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      dispatch(setPostsStatus('loading'));
      try {
        const postPage = await postService.getAllPosts(pageNum, LIMIT, category, search);
        const pagePosts = postPage.documents ?? [];
        const totalFetched = (pageNum === 1 ? 0 : (pageNum - 1) * LIMIT) + pagePosts.length;

        if (pageNum === 1) {
          dispatch(setPostList(pagePosts));
        } else {
          dispatch(appendPostPage(pagePosts));
        }
        dispatch(setPostPagination({ page: pageNum, hasMore: totalFetched < postPage.total }));
      } catch (error) {
        dispatch(setPostsError(error?.message ?? 'Failed to fetch posts'));
      } finally {
        loadingRef.current = false;
      }
    },
    [dispatch],
  );

  // 2. Initial load + reload when category OR debounced search changes
  useEffect(() => {
    dispatch(setPostPagination({ page: 1, hasMore: true }));
    loadPage(1, activeCategory, debouncedSearchTerm);
  }, [activeCategory, debouncedSearchTerm, loadPage, dispatch]);

  // 3. Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      const { innerHeight } = window;
      const { scrollTop, offsetHeight } = document.documentElement;

      if (innerHeight + scrollTop >= offsetHeight - 200) {
        loadPage(page + 1, activeCategory, debouncedSearchTerm);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, loadPage, debouncedSearchTerm, activeCategory]);

  const handleCategoryChange = useCallback(
    (category) => {
      const next = category === activeCategory ? null : category;
      setSearchTerm('');
      setDebouncedSearchTerm('');
      dispatch(setActiveCategory(next));
    },
    [dispatch, activeCategory],
  );

  return {
    posts,
    postsLoading: isPostsLoading,
    postsError,
    hasMore,
    searchTerm,
    activeCategory,
    handleSearchChange,
    handleCategoryChange,
    LIMIT,
  };
};
