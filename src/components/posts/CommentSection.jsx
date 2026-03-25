import { useState, useEffect } from 'react';
import { Loader2, MessageSquare, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { commentService } from '@/services/comments';
import { ConfirmationDialog, EmptyState } from '@/components/common';

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

      {/* compose */}
      {authUserId ? (
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 border border-border shrink-0 mt-1">
            {currentUserProfile?.avatarUrl && <AvatarImage src={currentUserProfile.avatarUrl} />}
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-xs">
              {currentUserName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts…"
              className="min-h-[80px] bg-background border-border resize-none focus-visible:ring-1 text-sm rounded-lg"
            />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">Ctrl+Enter to post</p>
              <Button
                onClick={handleCommentSubmit}
                disabled={isCommenting || !newComment.trim()}
                size="sm"
                className="gap-2 rounded-full text-xs px-4"
              >
                {isCommenting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {isCommenting ? 'Posting…' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="Sign in to comment"
          description="Join the discussion by signing in or creating an account."
          action={
            <Button asChild size="sm" className="rounded-full px-6">
              <Link to="/login">Sign In</Link>
            </Button>
          }
        />
      )}

      {/* list */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No comments yet"
            description="Be the first to share your thoughts."
          />
        ) : (
          comments.map((comment) => {
            const isMe = comment.userId === authUserId;
            const profile = isMe ? currentUserProfile : profiles[comment.userId];
            const name = profile?.name || (isMe ? currentUserName : 'Anonymous');

            return (
              <div key={comment.$id} className="flex gap-3 group">
                {/* Avatar */}
                <Avatar className="h-8 w-8 border border-border shrink-0 mt-1">
                  <AvatarImage src={profile?.avatarUrl} alt={name} />
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground leading-none">
                          {name}
                        </span>
                        <time className="text-xs text-muted-foreground">
                          {comment.$createdAt
                            ? new Date(comment.$createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Just now'}
                        </time>
                      </div>

                      {/* Actions (Dropdown instead of raw button) */}
                      {isMe && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCommentToDelete(comment)}
                          className="h-7 px-2 gap-1.5 text-xs font-medium text-destructive/70 opacity-60 group-hover:opacity-100 transition-all duration-200 hover:text-destructive  hover:bg-destructive/10 rounded-md"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

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
