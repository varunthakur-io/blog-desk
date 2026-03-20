import { useState, useEffect } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { commentService } from '@/services/comments';

const CommentSection = ({ postId, authUserId, currentUserProfile, initialComments, profiles }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const currentUserName = currentUserProfile?.name || 'You';

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content || !postId || !authUserId) return;

    setIsCommenting(true);
    const tempId = 'temp-' + Date.now();
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
      const createdComment = await commentService.addComment({ postId, userId: authUserId, content });
      setComments((prev) => prev.map((c) => (c.$id === tempId ? createdComment : c)));
      toast.success('Comment posted!');
    } catch {
      setComments((prev) => prev.filter((c) => c.$id !== tempId));
      setNewComment(content);
      toast.error('Failed to post comment');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-xl font-bold tracking-tight">Discussion</h3>
        <span className="ml-auto text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
          {comments.length}
        </span>
      </div>

      {/* Compose */}
      {authUserId ? (
        <div className="flex gap-3">
          <Avatar className="h-9 w-9 border border-border shrink-0 mt-0.5">
            {currentUserProfile?.avatarUrl && <AvatarImage src={currentUserProfile.avatarUrl} />}
            <AvatarFallback className="bg-accent text-primary font-semibold text-xs">
              {currentUserName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2.5">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts…"
              className="min-h-20 bg-muted/40 border-border/50 resize-none focus-visible:ring-1 focus-visible:ring-primary/40 text-sm rounded-xl"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCommentSubmit}
                disabled={isCommenting || !newComment.trim()}
                size="sm"
                className="px-5 rounded-full text-xs font-semibold"
              >
                {isCommenting ? (
                  <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Posting…</>
                ) : (
                  'Post Comment'
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 bg-muted/30 rounded-xl border border-dashed border-border">
          <p className="text-sm text-muted-foreground">Please log in to join the discussion.</p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-5">
        {comments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
            <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isMe = comment.userId === authUserId;
            const commenterProfile = isMe ? currentUserProfile : profiles[comment.userId];
            const name = commenterProfile?.name || (isMe ? currentUserName : 'Anonymous User');
            const avatarUrl = commenterProfile?.avatarUrl;

            return (
              <div key={comment.$id} className="flex gap-3">
                <Avatar className="h-8 w-8 border border-border shrink-0 mt-0.5">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/40 border border-border/40 rounded-xl px-4 py-3 hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="font-semibold text-xs text-foreground">{name}</span>
                      <time className="text-[11px] text-muted-foreground shrink-0">
                        {comment.$createdAt
                          ? new Date(comment.$createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </time>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">
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
