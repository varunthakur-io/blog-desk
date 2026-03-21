import { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@/services/posts';
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

  const loadPage = useCallback(
    async (pageNum, category) => {
      if (isPostsLoading) return;
      dispatch(setPostsStatus('loading'));
      try {
        const postPage = await postService.getAllPosts(pageNum, LIMIT, category);
        const pagePosts = postPage.documents ?? [];
        const totalFetched = (pageNum - 1) * LIMIT + pagePosts.length;

        if (pageNum === 1) {
          dispatch(setPostList(pagePosts));
        } else {
          dispatch(appendPostPage(pagePosts));
        }
        dispatch(setPostPagination({ page: pageNum, hasMore: totalFetched < postPage.total }));
      } catch (error) {
        dispatch(setPostsError(error?.message ?? 'Failed to fetch posts'));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  // Initial load + reload when category changes
  useEffect(() => {
    dispatch(setPostPagination({ page: 1 }));
    loadPage(1, activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, activeCategory]);

  // Infinite scroll — disabled while searching
  useEffect(() => {
    const handleScroll = () => {
      const { innerHeight } = window;
      const { scrollTop, offsetHeight } = document.documentElement;

      if (
        innerHeight + scrollTop >= offsetHeight - 150 &&
        !isPostsLoading &&
        hasMore &&
        !searchTerm
      ) {
        loadPage(page + 1, activeCategory);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPostsLoading, hasMore, page, loadPage, searchTerm, activeCategory]);

  // Client-side search filter on top of whatever page is loaded
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const q = searchTerm.toLowerCase().trim();
    return posts.filter((post) => {
      const title = post.title?.toLowerCase() ?? '';
      const content = post.content?.toLowerCase() ?? '';
      return title.includes(q) || content.includes(q);
    });
  }, [posts, searchTerm]);

  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm(e.target.value);
      dispatch(setPostPagination({ initialLoaded: false }));
    },
    [dispatch],
  );

  const handleCategoryChange = useCallback(
    (category) => {
      // Toggle: clicking the active category clears it
      const next = category === activeCategory ? null : category;
      setSearchTerm('');
      dispatch(setActiveCategory(next));
    },
    [dispatch, activeCategory],
  );

  return {
    posts: filteredPosts,
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
