import { useState, useEffect } from 'react';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { commentService } from '@/services/comments';

const CommentSection = ({ postId, authUserId, currentUserProfile, initialComments, profiles }) => {
  const [comments, setComments]     = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => { setComments(initialComments || []); }, [initialComments]);

  const currentUserName = currentUserProfile?.name || 'You';

  const handleCommentSubmit = async () => {
    const content = newComment.trim();
    if (!content || !postId || !authUserId) return;

    setIsCommenting(true);
    const tempId = 'temp-' + Date.now();
    setComments((prev) => [{
      $id: tempId, postId, userId: authUserId,
      content, $createdAt: new Date().toISOString(),
    }, ...prev]);
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
                {isCommenting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {isCommenting ? 'Posting…' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-8 text-center">
          <MessageSquare className="h-7 w-7 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-70">
              Sign in
            </Link>{' '}
            to join the discussion.
          </p>
        </div>
      )}

      {/* list */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="py-10 text-center">
            <MessageSquare className="h-7 w-7 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No comments yet. Be the first.</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isMe = comment.userId === authUserId;
            const profile = isMe ? currentUserProfile : profiles[comment.userId];
            const name = profile?.name || (isMe ? currentUserName : 'Anonymous');

            return (
              <div key={comment.$id} className="flex gap-3">
                <Avatar className="h-8 w-8 border border-border shrink-0 mt-0.5">
                  <AvatarImage src={profile?.avatarUrl} alt={name} />
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="rounded-xl border border-border bg-card px-4 py-3">
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <span className="text-xs font-semibold text-foreground">{name}</span>
                      <time className="text-[11px] text-muted-foreground shrink-0">
                        {comment.$createdAt
                          ? new Date(comment.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'Just now'}
                      </time>
                    </div>
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
    </div>
  );
};

export default CommentSection;
