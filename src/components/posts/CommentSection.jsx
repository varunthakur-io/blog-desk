import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { commentService } from '@/services/comments';

const CommentSection = ({ postId, authUserId, currentUserProfile, initialComments, profiles }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // CRITICAL FIX: Sync local state when parent fetches comments
  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
    }
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
      postId: postId,
      userId: authUserId,
      content,
      $createdAt: new Date().toISOString(),
    };

    // Add optimistically
    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment('');

    try {
      const createdComment = await commentService.addComment({
        postId: postId,
        userId: authUserId,
        content,
      });

      // Replace temp with real data from server
      setComments((prev) =>
        prev.map((c) => (c.$id === tempId ? createdComment : c)),
      );
      toast.success('Comment posted!');
    } catch (err) {
      // Revert on error
      setComments((prev) => prev.filter((c) => c.$id !== tempId));
      setNewComment(content);
      toast.error('Failed to post comment');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="space-y-8 pt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Discussion</h3>
        <Badge variant="secondary" className="rounded-full px-3">
          {comments.length} comments
        </Badge>
      </div>

      {authUserId ? (
        <Card className="border-dashed shadow-sm bg-muted/30">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                {currentUserProfile?.avatarUrl && <AvatarImage src={currentUserProfile.avatarUrl} />}
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {currentUserName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts on this?"
                  className="min-h-24 bg-background resize-none focus-visible:ring-1"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={isCommenting || !newComment.trim()}
                    className="px-6"
                  >
                    {isCommenting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-6 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-sm text-muted-foreground">Please log in to join the discussion.</p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => {
            // FIX: If it's the current user, use currentUserProfile directly
            const isMe = comment.userId === authUserId;
            const commenterProfile = isMe ? currentUserProfile : profiles[comment.userId];
            
            const name = commenterProfile?.name || (isMe ? currentUserName : 'Anonymous User');
            const avatarUrl = commenterProfile?.avatarUrl;
            const commentorInitial = name.charAt(0).toUpperCase();

            return (
              <div key={comment.$id} className="group flex gap-4 transition-all">
                <Avatar className="h-10 w-10 border border-muted bg-background mt-1 shadow-sm">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-medium text-xs">
                    {commentorInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-card border rounded-2xl p-4 shadow-sm relative hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{name}</span>
                      <time className="text-xs text-muted-foreground">
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
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
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
