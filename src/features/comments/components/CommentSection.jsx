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

// CommentItem: individual user contribution with meta and actions

const CommentItem = ({ comment, isMe, onDeleteClick }) => {
  // Fetch profile identity for the comment author
  const { profile, displayName, avatarUrl } = useProfileIdentity({ userId: comment.userId });

  return (
    <div className="border-border/20 group animate-in fade-in border-b py-6 duration-500 first:pt-0 last:border-0">
      <div className="mb-2 flex gap-4">
        {/* Author Avatar */}
        <Link to={`/profile/${profile?.username}`} className="shrink-0">
          <Avatar className="bg-muted ring-border/20 hover:ring-primary/20 size-8 border-none ring-1 transition-all">
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
            )}
            <AvatarFallback className="text-muted-foreground text-[10px] font-bold uppercase">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            {/* Author Meta */}
            <div className="flex min-w-0 items-center gap-2">
              <Link
                to={`/profile/${profile?.username}`}
                className="text-foreground hover:text-primary truncate text-[13px] font-bold tracking-tight transition-colors"
              >
                {displayName}
              </Link>
              <span className="text-muted-foreground/30 text-[10px]">•</span>
              <time className="text-muted-foreground/50 text-[12px] font-medium tabular-nums">
                {formatDate(comment.$createdAt)}
              </time>

              {!isMe && (
                <FollowButton
                  userId={comment.userId}
                  variant="ghost"
                  size="xs"
                  className="text-primary hover:bg-primary/5 border-primary/20 ml-1 h-5 rounded-md border px-2 text-[10px] font-bold"
                />
              )}
            </div>
            
            {/* Contextual Actions */}
            {isMe && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteClick}
                className="text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 h-7 gap-1.5 rounded-md px-2 text-[10px] font-bold tracking-wider uppercase opacity-0 transition-all group-hover:opacity-100"
              >
                <Trash2 className="size-3" />
                <span>Delete</span>
              </Button>
            )}
          </div>

          {/* Comment body */}
          <div className="mt-1.5 px-0.5">
            <p className="text-foreground/90 text-[14px] leading-relaxed tracking-tight whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// CommentForm: input area for new contributions

const CommentForm = ({
  authUserId,
  currentUserProfile,
  newComment,
  setNewComment,
  isCommenting,
  onSubmit,
  onKeyDown,
}) => {
  // Handle unauthenticated state
  if (!authUserId) {
    return (
      <div className="border-border/40 bg-muted/5 mb-10 rounded-md border py-8 text-center">
        <p className="text-muted-foreground mb-4 text-[13px] font-bold tracking-tight">
          Sign in to join the conversation
        </p>
        <Button
          asChild
          size="sm"
          className="bg-foreground text-background h-9 rounded-md px-6 text-xs font-bold transition-all active:scale-95"
        >
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const currentUserName = currentUserProfile?.name || 'You';

  return (
    <div className="group bg-background border-border/60 focus-within:border-foreground/20 focus-within:ring-foreground/[0.02] mb-10 rounded-md border p-4 transition-all outline-none focus-within:ring-4">
      <div className="flex gap-4">
        <Avatar className="bg-muted ring-border/20 size-8 shrink-0 border-none shadow-sm ring-1">
          {currentUserProfile?.avatarUrl && (
            <AvatarImage src={currentUserProfile.avatarUrl} className="object-cover" />
          )}
          <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold uppercase">
            {currentUserName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {/* Input field */}
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a comment..."
          className="placeholder:text-muted-foreground/30 mt-0.5 min-h-[40px] w-full resize-none border-0 bg-transparent p-0 text-[14px] leading-relaxed shadow-none focus:outline-none focus-visible:ring-0"
        />
      </div>
      
      {/* Form Utilities */}
      <div className="border-border/10 mt-3 flex items-center justify-between border-t pt-3">
        <p className="text-muted-foreground/30 text-[10px] font-bold tracking-tight uppercase">
          Ctrl + Enter to post
        </p>
        <Button
          onClick={onSubmit}
          disabled={isCommenting || !newComment.trim()}
          size="sm"
          className="bg-foreground text-background h-8 gap-2 rounded-md px-4 text-xs font-bold transition-all hover:opacity-90 active:scale-95"
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

// CommentSection: root component for post engagement

const CommentSection = ({ postId, authUserId, currentUserProfile, initialComments }) => {
  // Discussion thread management state
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
      {/* Engagement Header */}
      <div className="mb-8 flex items-center gap-3">
        <h3 className="text-foreground text-[17px] font-black tracking-tighter">Comments</h3>
        <span className="text-muted-foreground/40 text-xs font-bold tabular-nums">
          {comments.length}
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

      {/* Unified thread */}
      {comments.length === 0 ? (
        <div className="border-border/10 border-t py-12">
          <p className="text-muted-foreground/40 text-center text-[13px] font-bold tracking-tight">
            Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem
              key={comment.$id}
              comment={comment}
              isMe={comment.userId === authUserId}
              onDeleteClick={() => setCommentToDelete(comment)}
            />
          ))}
        </div>
      )}

      {/* Modals & Dialogs */}
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
