import React from 'react';
import { Loader2, MessageSquare, Send, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { ConfirmationDialog, EmptyState, FollowButton } from '@/components/common';
import { useComments } from '@/features/comments';
import { useProfile } from '@/features/profile';

// Sub-components

const CommentItem = ({ comment, isMe, onDeleteClick }) => {
  const { profile, displayName, avatarUrl } = useProfile(comment.userId);

  return (
    <div className="flex gap-3 group">
      <Link to={`/profile/${profile?.username}`} className="mt-1 shrink-0">
        <Avatar className="h-8 w-8 border border-border transition-transform hover:scale-105">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40 text-left">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${profile?.username}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors leading-none">
                {displayName}
              </Link>
              <time className="text-xs text-muted-foreground font-medium">
                {comment.$createdAt
                  ? new Date(comment.$createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Just now'}
              </time>
              {!isMe && (
                <FollowButton 
                  userId={comment.userId} 
                  variant="ghost" 
                  size="xs" 
                  className="h-5 px-2 text-[9px] uppercase tracking-tighter" 
                />
              )}
            </div>

            {isMe && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteClick}
                className="h-7 px-2 gap-1.5 text-xs font-medium text-destructive/70 opacity-60 group-hover:opacity-100 transition-all duration-200 hover:text-destructive hover:bg-destructive/10 rounded-md"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>

          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
};

const CommentList = ({
  comments,
  authUserId,
  onDeleteClick,
}) => {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No comments yet"
        description="Be the first to share your thoughts."
      />
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.$id}
          comment={comment}
          isMe={comment.userId === authUserId}
          onDeleteClick={() => onDeleteClick(comment)}
        />
      ))}
    </div>
  );
};

const CommentForm = ({
  authUserId,
  currentUserProfile,
  currentUserName,
  newComment,
  setNewComment,
  isCommenting,
  onSubmit,
  onKeyDown,
}) => {
  if (!authUserId) {
    return (
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
    );
  }

  return (
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
          onKeyDown={onKeyDown}
          placeholder="Share your thoughts…"
          className="min-h-[80px] bg-background border-border resize-none focus-visible:ring-1 text-sm rounded-lg"
        />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">Ctrl+Enter to post</p>
          <Button
            onClick={onSubmit}
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
  );
};

// Main Component

const CommentSection = ({ postId, authUserId, currentUserProfile, initialComments }) => {
  const {
    comments,
    newComment,
    setNewComment,
    isCommenting,
    isDeleting,
    commentToDelete,
    setCommentToDelete,
    handleCommentSubmit,
    handleKeyDown,
    confirmDelete,
  } = useComments(postId, initialComments, authUserId);

  const currentUserName = currentUserProfile?.name || 'You';

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
        onDeleteClick={setCommentToDelete}
      />

      <ConfirmationDialog
        open={!!commentToDelete}
        onOpenChange={(open) => !open && !isDeleting && setCommentToDelete(null)}
        onConfirm={confirmDelete}
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
