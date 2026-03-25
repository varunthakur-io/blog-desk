import React from 'react';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/common';

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

export default CommentForm;
