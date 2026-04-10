import React from 'react';
import { Trash2, Loader2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { ConfirmationDialog } from '@/components/common';
import { FollowButton } from '@/features/follows';
import { useComments } from '@/features/comments';
import { useProfileIdentity } from '@/features/profile';
import { formatDate } from '@/utils/formatters';

/* ───────────────────────────────────────────── */
/* Comment Item */
/* ───────────────────────────────────────────── */

const CommentItem = ({ comment, isMe, onDeleteClick }) => {
  const { profile, displayName, avatarUrl } = useProfileIdentity({ userId: comment.userId });

  return (
    <div className="py-8 first:pt-0 border-b border-border/40 last:border-0 group">
      <div className="flex gap-3 mb-3">
        <Link to={`/profile/${profile?.username}`} className="shrink-0 transition-opacity hover:opacity-80">
          <Avatar className="h-8 w-8 border border-border/60 shadow-sm">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />}
            <AvatarFallback className="text-[10px] font-bold uppercase">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                to={`/profile/${profile?.username}`}
                className="font-bold text-[13px] text-foreground hover:underline truncate"
              >
                {displayName}
              </Link>
              <span className="text-muted-foreground/40 text-[10px]">•</span>
              <time className="text-[12px] text-muted-foreground whitespace-nowrap">
                {formatDate(comment.$createdAt)}
              </time>

              {!isMe && (
                <FollowButton
                  userId={comment.userId}
                  variant="ghost"
                  size="xs"
                  className="h-5 px-2 text-[10px] font-bold text-primary hover:bg-primary/5 rounded-full ml-1"
                />
              )}
            </div>

            {isMe && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDeleteClick}
                className="h-7 px-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-md gap-1.5 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="pl-11">
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-foreground/90">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────── */
/* Comment Form */
/* ───────────────────────────────────────────── */

const CommentForm = ({
  authUserId,
  currentUserProfile,
  newComment,
  setNewComment,
  isCommenting,
  onSubmit,
  onKeyDown,
}) => {
  if (!authUserId) {
    return (
      <div className="py-10 text-center rounded-2xl border border-border bg-muted/10 mb-12">
        <p className="text-sm text-muted-foreground mb-4 font-medium">Sign in to join the conversation</p>
        <Button asChild size="sm" className="rounded-full px-8 shadow-sm h-9">
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const currentUserName = currentUserProfile?.name || 'You';

  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-12 shadow-sm focus-within:shadow-md transition-shadow">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 border border-border/50 shrink-0 shadow-sm">
          {currentUserProfile?.avatarUrl && <AvatarImage src={currentUserProfile.avatarUrl} className="object-cover" />}
          <AvatarFallback className="bg-muted text-muted-foreground font-bold text-[10px] uppercase">
            {currentUserName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="What are your thoughts?"
          className="min-h-[60px] w-full bg-transparent border-0 shadow-none resize-none focus-visible:ring-0 p-0 text-[15px] leading-relaxed placeholder:text-muted-foreground/40 mt-1"
        />
      </div>
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Press Ctrl + Enter to post
        </p>
        <Button
          onClick={onSubmit}
          disabled={isCommenting || !newComment.trim()}
          size="sm"
          className="gap-2 rounded-full text-xs font-bold px-6 h-8 shadow-sm transition-all active:scale-95"
        >
          {isCommenting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          Comment
        </Button>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────── */
/* Comment Section */
/* ───────────────────────────────────────────── */

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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <h3 className="text-xl font-extrabold tracking-tight">Comments</h3>
        <span className="text-sm font-bold text-muted-foreground opacity-50">
          ({comments.length})
        </span>
      </div>

      <CommentForm
        authUserId={authUserId}
        currentUserProfile={currentUserProfile}
        newComment={newComment}
        setNewComment={setNewComment}
        isCommenting={isCommenting}
        onSubmit={handleCommentSubmit}
        onKeyDown={handleKeyDown}
      />

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="py-12 border-t border-border/40">
          <p className="text-sm text-center text-muted-foreground font-medium">
            No comments yet. Start the conversation.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/10">
          <div className="flex flex-col animate-in fade-in duration-700">
            {comments.map((comment) => (
              <CommentItem
                key={comment.$id}
                comment={comment}
                isMe={comment.userId === authUserId}
                onDeleteClick={() => setCommentToDelete(comment)}
              />
            ))}
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={!!commentToDelete}
        onOpenChange={(open) => !open && !isDeleting && setCommentToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        variant="destructive"
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CommentSection;
