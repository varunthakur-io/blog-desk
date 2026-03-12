import { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@/services/posts';
import {
  selectAllPosts,
  selectPostsLoading,
  selectPostsError,
  selectHasMore,
  selectPage,
  setPostsLoading,
  setPostsError,
  setPosts,
  appendPosts,
  setPage,
  setHasMore,
  setInitialLoaded,
} from '@/store/posts';

const LIMIT = 6;

export const useHome = (categories) => {
  const dispatch = useDispatch();

  // Selectors from Redux
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const hasMore = useSelector(selectHasMore);
  const page = useSelector(selectPage);


  // Local state for UI filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadPage = useCallback(
    async (pageNum, categoryFilter = null) => {
      dispatch(setPostsLoading(true));
      dispatch(setPostsError(null));

      try {
        const data = await postService.getAllPosts(
          pageNum,
          LIMIT,
          categoryFilter === 'All' ? null : categoryFilter,
        );
        const docs = data.documents ?? [];
        const totalFetched = (pageNum - 1) * LIMIT + docs.length;

        if (pageNum === 1) {
          dispatch(setPosts(docs));
        } else {
          dispatch(appendPosts(docs));
        }

        dispatch(setPage(pageNum));
        dispatch(setHasMore(totalFetched < data.total));
      } catch (err) {
        dispatch(setPostsError(err?.message ?? 'Failed to fetch posts'));
      } finally {
        dispatch(setPostsLoading(false));
      }
    },
    [dispatch],
  );

  // Handle Initial Load or Category Changes
  useEffect(() => {
    dispatch(setPage(1));
    loadPage(1, selectedCategory);
  }, [selectedCategory, loadPage, dispatch]);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 150 &&
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

  // Filtered display list
  const filteredPosts = useMemo(() => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return posts.filter((post) => {
        const title = post.title?.toLowerCase() ?? '';
        const content = post.content?.toLowerCase() ?? '';
        return title.includes(q) || content.includes(q);
      });
    }
    return posts;
  }, [posts, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
    dispatch(setInitialLoaded(false));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCategory('All');
    dispatch(setInitialLoaded(false));
  };

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
