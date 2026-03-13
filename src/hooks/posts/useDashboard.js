import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { debounce } from '@/lib/utils';
import { postService } from '@/services/posts';
import { selectAuthUserId } from '@/store/auth';
import { 
  selectIsPostsLoading, 
  selectPostsError, 
  setPostsStatus, 
  setPostsError, 
  clearPostRecord
} from '@/store/posts';
import { DASHBOARD_POSTS_PER_PAGE } from '@/constants';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);
  const postsLoading = useSelector(selectIsPostsLoading);
  const postsError = useSelector(selectPostsError);

  const [posts, setLocalPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const LIMIT = DASHBOARD_POSTS_PER_PAGE;

  // Search logic
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchDebounce = useCallback(
    debounce((query) => {
      setDebouncedQuery(query);
      setPage(1);
    }, 500),
    [],
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    handleSearchDebounce(e.target.value);
  }, [handleSearchDebounce]);

  const fetchUserPosts = useCallback(async () => {
    if (!authUserId) return;
    try {
      dispatch(setPostsStatus('loading'));

      const data = await postService.getPostsByUserId(
        authUserId,
        page,
        LIMIT,
        debouncedQuery,
        statusFilter,
        sortBy,
      );

      const docs = Array.isArray(data.documents) ? data.documents : [];
      setLocalPosts(docs);
      setTotalPosts(data.total);
      setTotalPages(Math.ceil(data.total / LIMIT));
      dispatch(setPostsStatus('success'));
    } catch (err) {
      dispatch(setPostsError(err?.message || 'Failed to fetch posts'));
    }
  }, [dispatch, authUserId, page, debouncedQuery, statusFilter, sortBy, LIMIT]);

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
      setLocalPosts((prev) => prev.filter((p) => p.$id !== postToDelete.$id));
      setTotalPosts((prev) => Math.max(0, prev - 1));
      toast.success('Post deleted successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  }, [postToDelete, dispatch]);

  return {
    posts,
    postsLoading,
    postsError,
    page,
    setPage,
    searchQuery,
    handleSearchChange,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
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
