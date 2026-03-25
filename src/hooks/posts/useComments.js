import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { commentService } from '@/services/comments';

/**
 * Headless hook for managing comment logic: fetching, posting, and deleting.
 * Contains ZERO UI/JSX.
 */
export const useComments = (postId, initialComments, authUserId) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // UI state for deletion
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync with initial comments if they change (e.g. on fresh post load)
  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handleCommentSubmit = useCallback(async () => {
    const content = newComment.trim();
    if (!content || !postId || !authUserId) return;

    setIsCommenting(true);
    const tempId = 'temp-' + Date.now();

    // Optimistic Update
    const optimisticComment = {
      $id: tempId,
      postId,
      userId: authUserId,
      content,
      $createdAt: new Date().toISOString(),
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment('');

    try {
      const created = await commentService.addComment({ postId, userId: authUserId, content });
      // Replace optimistic entry with real server data
      setComments((prev) => prev.map((c) => (c.$id === tempId ? created : c)));
      toast.success('Comment posted!');
    } catch {
      // Rollback on failure
      setComments((prev) => prev.filter((c) => c.$id !== tempId));
      setNewComment(content);
      toast.error('Failed to post comment');
    } finally {
      setIsCommenting(false);
    }
  }, [newComment, postId, authUserId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleCommentSubmit();
      }
    },
    [handleCommentSubmit],
  );

  const confirmDelete = useCallback(async () => {
    if (!commentToDelete || !postId) return;

    setIsDeleting(true);
    try {
      await commentService.deleteComment(commentToDelete.$id, postId);
      setComments((prev) => prev.filter((c) => c.$id !== commentToDelete.$id));
      toast.success('Comment deleted!');
    } catch {
      toast.error('Failed to delete comment');
    } finally {
      setCommentToDelete(null);
      setIsDeleting(false);
    }
  }, [commentToDelete, postId]);

  return {
    // Data state
    comments,
    newComment,
    setNewComment,

    // Action states
    isCommenting,
    isDeleting,
    commentToDelete,
    setCommentToDelete,

    // Handlers
    handleCommentSubmit,
    handleKeyDown,
    confirmDelete,
  };
};
