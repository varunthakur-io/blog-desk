import { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@/services/posts';
import {
  selectAllPosts,
  selectIsPostsLoading,
  selectPostsError,
  selectHasMore,
  selectPage,
  setPostsStatus,
  setPostsError,
  setPostList,
  appendPostPage,
  setPostPagination,
} from '@/store/posts';
import { POSTS_PER_PAGE } from '@/constants';

const LIMIT = POSTS_PER_PAGE;

export const useHome = (categories) => {
  const dispatch = useDispatch();

  // Redux Selectors
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectIsPostsLoading);
  const error = useSelector(selectPostsError);
  const hasMore = useSelector(selectHasMore);
  const page = useSelector(selectPage);

  // Local UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadPage = useCallback(
    async (pageNum, categoryFilter = null) => {
      if (loading) return; 
      dispatch(setPostsStatus('loading'));

      try {
        const data = await postService.getAllPosts(
          pageNum,
          LIMIT,
          categoryFilter === 'All' ? null : categoryFilter,
        );
        const docs = data.documents ?? [];
        const totalFetched = (pageNum - 1) * LIMIT + docs.length;

        if (pageNum === 1) {
          dispatch(setPostList(docs));
        } else {
          dispatch(appendPostPage(docs));
        }

        dispatch(setPostPagination({ page: pageNum, hasMore: totalFetched < data.total }));
      } catch (err) {
        dispatch(setPostsError(err?.message ?? 'Failed to fetch posts'));
      }
    },
    [dispatch, loading],
  );

  // Initial Load / Filter Change
  useEffect(() => {
    dispatch(setPostPagination({ page: 1 }));
    loadPage(1, selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, dispatch]);

  // Infinite Scroll Observer
  useEffect(() => {
    const handleScroll = () => {
      const { innerHeight } = window;
      const { scrollTop, offsetHeight } = document.documentElement;
      
      if (
        innerHeight + scrollTop >= offsetHeight - 150 &&
        !loading &&
        hasMore &&
        !searchTerm
      ) {
        loadPage(page + 1, selectedCategory);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page, loadPage, searchTerm, selectedCategory]);

  // Client-side search filtering
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    
    const q = searchTerm.toLowerCase().trim();
    return posts.filter((post) => {
      const title = post.title?.toLowerCase() ?? '';
      const content = post.content?.toLowerCase() ?? '';
      return title.includes(q) || content.includes(q);
    });
  }, [posts, searchTerm]);

  const handleCategoryChange = useCallback((category) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    setSearchTerm('');
    dispatch(setPostPagination({ initialLoaded: false }));
  }, [selectedCategory, dispatch]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setSelectedCategory('All');
    dispatch(setPostPagination({ initialLoaded: false }));
  }, [dispatch]);

  return {
    posts: filteredPosts,
    loading,
    error,
    hasMore,
    searchTerm,
    selectedCategory,
    handleCategoryChange,
    handleSearchChange,
    LIMIT,
  };
};
