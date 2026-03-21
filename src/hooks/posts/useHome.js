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

export const useHome = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const posts = useSelector(selectAllPosts);
  const isPostsLoading = useSelector(selectIsPostsLoading);
  const postsError = useSelector(selectPostsError);
  const hasMore = useSelector(selectHasMore);
  const page = useSelector(selectPage);

  // Local UI State
  const [searchTerm, setSearchTerm] = useState('');

  const loadPage = useCallback(
    async (pageNum) => {
      if (isPostsLoading) return;
      dispatch(setPostsStatus('loading'));

      try {
        const postPage = await postService.getAllPosts(pageNum, LIMIT);
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
    [dispatch, isPostsLoading],
  );

  // Initial Load
  useEffect(() => {
    dispatch(setPostPagination({ page: 1 }));
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Infinite Scroll Observer
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
        loadPage(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPostsLoading, hasMore, page, loadPage, searchTerm]);

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

  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm(e.target.value);
      dispatch(setPostPagination({ initialLoaded: false }));
    },
    [dispatch],
  );

  return {
    // post feed
    posts: filteredPosts,

    // loading state
    loading: isPostsLoading,
    error: postsError,
    hasMore,

    // search state
    searchTerm,

    // actions
    handleSearchChange,
    LIMIT,
  };
};
