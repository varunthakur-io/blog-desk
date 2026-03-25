import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { commentService } from '@/services/comments';
import { ConfirmationDialog } from '@/components/common';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const CommentSection = ({ postId, authUserId, currentUserProfile, initialComments, profiles }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // UI state for deletion
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const currentUserName = currentUserProfile?.name || 'You';

  const handleCommentSubmit = async () => {
    const content = newComment.trim();
    if (!content || !postId || !authUserId) return;

    setIsCommenting(true);
    const tempId = 'temp-' + Date.now();
    setComments((prev) => [
      {
        $id: tempId,
        postId,
        userId: authUserId,
        content,
        $createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewComment('');

    try {
      const created = await commentService.addComment({ postId, userId: authUserId, content });
      setComments((prev) => prev.map((c) => (c.$id === tempId ? created : c)));
      toast.success('Comment posted!');
    } catch {
      setComments((prev) => prev.filter((c) => c.$id !== tempId));
      setNewComment(content);
      toast.error('Failed to post comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCommentSubmit();
  };

  const onDeleteConfirm = async () => {
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
  };

  return (
    <div className="space-y-8">
      {/* header */}
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold tracking-tight">Discussion</h3>
        {comments.length > 0 && (
          <span className="text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {comments.length}
          </span>
        )}
        <div className="flex-1 h-px bg-border" />
      </div>

      <CommentForm
        authUserId={authUserId}
        currentUserProfile={currentUserProfile}
        currentUserName={currentUserName}
        newComment={newComment}
        setNewComment={setNewComment}
        isCommenting={isCommenting}
        onSubmit={handleCommentSubmit}
        onKeyDown={handleKeyDown}
      />

      <CommentList
        comments={comments}
        authUserId={authUserId}
        currentUserProfile={currentUserProfile}
        profiles={profiles}
        currentUserName={currentUserName}
        onDeleteClick={setCommentToDelete}
      />

      <ConfirmationDialog
        open={!!commentToDelete}
        onOpenChange={(open) => !open && !isDeleting && setCommentToDelete(null)}
        onConfirm={onDeleteConfirm}
        isLoading={isDeleting}
        variant="destructive"
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CommentSection;
