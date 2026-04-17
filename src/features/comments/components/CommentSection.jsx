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
    <div className="py-6 first:pt-0 border-b border-border/20 last:border-0 group animate-in fade-in duration-500">
      <div className="flex gap-4 mb-2">
        <Link to={`/profile/${profile?.username}`} className="shrink-0">
          <Avatar className="size-8 border-none bg-muted ring-1 ring-border/20 transition-all hover:ring-primary/20">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />}
            <AvatarFallback className="text-[10px] font-bold uppercase text-muted-foreground">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                to={`/profile/${profile?.username}`}
                className="font-bold text-[13px] text-foreground hover:text-primary transition-colors truncate tracking-tight"
              >
                {displayName}
              </Link>
              <span className="text-muted-foreground/30 text-[10px]">•</span>
              <time className="text-[12px] font-medium text-muted-foreground/50 tabular-nums">
                {formatDate(comment.$createdAt)}
              </time>

              {!isMe && (
                <FollowButton
                  userId={comment.userId}
                  variant="ghost"
                  size="xs"
                  className="h-5 px-2 text-[10px] font-bold text-primary hover:bg-primary/5 rounded-md ml-1 border border-primary/20"
                />
              )}
            </div>

            {isMe && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDeleteClick}
                className="h-7 px-2 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 rounded-md gap-1.5 font-bold text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="size-3" />
                <span>Delete</span>
              </Button>
            )}
          </div>
          
          <div className="mt-1.5 px-0.5">
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-foreground/90 tracking-tight">
              {comment.content}
            </p>
          </div>
        </div>
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
      <div className="py-8 text-center rounded-md border border-border/40 bg-muted/5 mb-10">
        <p className="text-[13px] text-muted-foreground mb-4 font-bold tracking-tight">Sign in to join the conversation</p>
        <Button asChild size="sm" className="rounded-md px-6 bg-foreground text-background h-9 font-bold text-xs active:scale-95 transition-all">
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const currentUserName = currentUserProfile?.name || 'You';

  return (
    <div className="group bg-background border border-border/60 rounded-md p-4 mb-10 transition-all focus-within:border-foreground/20 focus-within:ring-4 focus-within:ring-foreground/[0.02] outline-none">
      <div className="flex gap-4">
        <Avatar className="size-8 border-none bg-muted shrink-0 ring-1 ring-border/20 shadow-sm">
          {currentUserProfile?.avatarUrl && <AvatarImage src={currentUserProfile.avatarUrl} className="object-cover" />}
          <AvatarFallback className="bg-muted text-muted-foreground font-bold text-[10px] uppercase">
            {currentUserName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a comment..."
          className="min-h-[40px] w-full bg-transparent border-0 shadow-none resize-none focus-visible:ring-0 p-0 text-[14px] leading-relaxed placeholder:text-muted-foreground/30 mt-0.5 focus:outline-none"
        />
      </div>
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/10">
        <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/30">
          Ctrl + Enter to post
        </p>
        <Button
          onClick={onSubmit}
          disabled={isCommenting || !newComment.trim()}
          size="sm"
          className="gap-2 rounded-md text-xs font-bold px-4 h-8 bg-foreground text-background hover:opacity-90 transition-all active:scale-95"
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
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-[17px] font-black tracking-tighter text-foreground">Comments</h3>
        <span className="text-xs font-bold text-muted-foreground/40 tabular-nums">
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

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="py-12 border-t border-border/10">
          <p className="text-[13px] text-center text-muted-foreground/40 font-bold tracking-tight">
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
