import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { debounce } from '@/lib/utils';
import { postService } from '@/features/posts';
import { selectAuthUserId } from '@/features/auth';
import {
  selectIsPostsLoading,
  selectPostsError,
  setPostsStatus,
  setPostsError,
  clearPostRecord,
} from '@/features/posts';
import { DASHBOARD_POSTS_PER_PAGE } from '@/constants';
import { getUniqueProfileIds, prefetchProfiles } from '@/features/profile/utils/prefetchProfiles';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);
  const postsLoading = useSelector(selectIsPostsLoading);
  const postsError = useSelector(selectPostsError);

  const [dashboardPosts, setDashboardPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    searchQuery: '',
    debouncedQuery: '',
    statusFilter: 'all',
    sortBy: 'newest',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const LIMIT = DASHBOARD_POSTS_PER_PAGE;

  // Search logic
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchDebounce = useCallback(
    debounce((query) => {
      setFilters((prev) => ({ ...prev, debouncedQuery: query, page: 1 }));
    }, 500),
    [],
  );

  const handleSearchChange = useCallback(
    (e) => {
      const nextSearchQuery = e.target.value;
      setFilters((prev) => ({ ...prev, searchQuery: nextSearchQuery }));
      handleSearchDebounce(e.target.value);
    },
    [handleSearchDebounce],
  );

  const fetchUserPosts = useCallback(async () => {
    if (!authUserId) return;
    try {
      dispatch(setPostsStatus('loading'));

      const postPage = await postService.getPostsByUserId(
        authUserId,
        filters.page,
        LIMIT,
        filters.debouncedQuery,
        filters.statusFilter,
        filters.sortBy,
      );

      const pagePosts = Array.isArray(postPage.documents) ? postPage.documents : [];
      const authorIds = getUniqueProfileIds(pagePosts, (post) => post.authorId);
      prefetchProfiles(dispatch, authorIds, 'Dashboard profile prefetch');

      setDashboardPosts(pagePosts);
      setTotalPosts(postPage.total);
      setTotalPages(Math.ceil(postPage.total / LIMIT));
      dispatch(setPostsStatus('success'));
    } catch (error) {
      dispatch(setPostsError(error?.message || 'Failed to fetch posts'));
    }
  }, [dispatch, authUserId, filters, LIMIT]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  // Delete logic
  const handleDeleteClick = useCallback((post) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await postService.clearPostById(postToDelete.$id);
      dispatch(clearPostRecord(postToDelete.$id));
      setDashboardPosts((prev) => prev.filter((post) => post.$id !== postToDelete.$id));
      setTotalPosts((prev) => Math.max(0, prev - 1));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  }, [postToDelete, dispatch]);

  return {
    posts: dashboardPosts,
    postsLoading,
    postsError,
    page: filters.page,
    setPage: (valueOrUpdater) =>
      setFilters((prev) => ({
        ...prev,
        page: typeof valueOrUpdater === 'function' ? valueOrUpdater(prev.page) : valueOrUpdater,
      })),
    searchQuery: filters.searchQuery,
    handleSearchChange,
    statusFilter: filters.statusFilter,
    setStatusFilter: (statusFilter) => setFilters((prev) => ({ ...prev, statusFilter, page: 1 })),
    sortBy: filters.sortBy,
    setSortBy: (sortBy) => setFilters((prev) => ({ ...prev, sortBy, page: 1 })),
    totalPages,
    totalPosts,
    isDeleting,
    postToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteClick,
    confirmDelete,
  };
};
