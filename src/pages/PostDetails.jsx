// PostDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Calendar, Heart, User, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

// Store & Services
import { postService } from '@/services/postService';
import { appendPosts, selectPostById } from '@/store/postSlice';
import { selectAuthUserId } from '@/store/authSlice';
import { selectProfileById } from '@/store/profileSlice';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Post & User State from Redux
  const currentPost = useSelector((state) => selectPostById(state, id));
  const authUserId = useSelector(selectAuthUserId);
  const userProfile = useSelector((state) =>
    selectProfileById(state, authUserId),
  );

  // Local States
  const [isLoading, setIsLoading] = useState(!currentPost);
  const [error, setError] = useState(''); // local error

  const [likesCount, setLikesCount] = useState(currentPost?.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikedLoading, setIsLikedLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  // Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // Effect 1: Fetch Post Data (Only if missing)
  useEffect(() => {
    if (!id) {
      setError('No post ID provided.');
      return;
    }

    // If we already have the post, just ensure loading is false and stop.
    if (currentPost) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setError('');

    const fetchPost = async () => {
      try {
        const fetchedPost = await postService.getPostById(id);
        if (!mounted) return;

        if (fetchedPost) {
          dispatch(appendPosts([fetchedPost]));
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load post. Please try again.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchPost();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  // Effect 2: Sync Local State & Check Like Status
  useEffect(() => {
    if (!currentPost) return;

    // 1. Sync likes count from store (runs when Post ID changes)
    setLikesCount(currentPost.likesCount || 0);

    // 2. Check if user liked
    let mounted = true;
    const checkUserLike = async () => {
      if (!authUserId) {
        setIsLiked(false);
        setIsLikedLoading(false);
        return;
      }

      setIsLikedLoading(true);
      try {
        const liked = await postService.hasUserLiked(
          currentPost.$id,
          authUserId,
        );
        if (mounted) setIsLiked(!!liked);
      } catch (e) {
        console.error('Failed to check like status:', e);
      } finally {
        if (mounted) setIsLikedLoading(false);
      }
    };

    checkUserLike();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPost?.$id, authUserId]);

  // Handlers
  const handleLike = async () => {
    if (!authUserId) return toast.error('You must be logged in to like.');
    if (!currentPost?.$id) return;
    if (isLikedLoading || isLiking) return;

    setIsLiking(true);

    const wasLiked = isLiked;
    const delta = wasLiked ? -1 : 1;

    // optimistic UI
    setIsLiked(!wasLiked);
    setLikesCount((prev) => Math.max(0, prev + delta));

    try {
      if (wasLiked) {
        await postService.unlikePost(currentPost.$id, authUserId);
        toast.success('Post unliked!');
      } else {
        await postService.likePost(currentPost.$id, authUserId);
        toast.success('Post liked!');
      }
    } catch {
      // rollback
      setIsLiked(wasLiked);
      setLikesCount((prev) => Math.max(0, prev - delta));
      toast.error('Like action failed.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!authUserId) {
      toast.error('You must be logged in to comment.');
      return;
    }

    setIsCommenting(true);
    const tempId = Date.now();

    const commentData = {
      $id: tempId,
      text: newComment,
      authorName: userProfile?.name || 'You',
      $createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setComments((prev) => [commentData, ...prev]);
    setNewComment('');

    try {
      // Assuming postService.addComment exists and returns the permanent comment object
      const actualComment = await postService.addComment(
        currentPost.$id,
        newComment,
      );

      // Replace temporary comment with actual data from backend
      setComments((prev) =>
        prev.map((c) => (String(c.$id) === String(tempId) ? actualComment : c)),
      );
      toast.success('Comment posted!');
    } catch {
      // Rollback on failure
      setComments((prev) =>
        prev.filter((c) => String(c.$id) !== String(tempId)),
      );
      setNewComment(commentData.text);
      toast.error('Failed to post comment.');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();

      try {
        document.execCommand('copy');
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to copy URL.');
      }

      document.body.removeChild(el);
    }
  };

  // Render States
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Loading article...
        </p>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {error || 'The article you are looking for does not exist.'}
                </AlertDescription>
              </Alert>
              <Button onClick={() => navigate('/')} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto border-border/50 shadow-lg">
        <CardHeader className="border-0 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
                {currentPost.title}
              </CardTitle>

              <CardDescription className="flex items-center space-x-3 text-sm flex-wrap mt-3">
                <Badge
                  variant="secondary"
                  className="font-medium flex items-center gap-1"
                >
                  <User className="h-3.5 w-3.5" /> By{' '}
                  {currentPost.authorName || 'Anonymous'}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={currentPost.$createdAt}>
                    {currentPost.$createdAt
                      ? new Date(currentPost.$createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )
                      : '—'}
                  </time>
                </div>
              </CardDescription>
            </div>

            {/* Back Button */}
            <div className="shrink-0 ml-4">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Article Content */}
        <CardContent className="pt-6">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-justify">
              {currentPost.content}
            </p>
          </div>
        </CardContent>

        <Separator />

        {/* Like and Share Actions */}
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLike}
              variant={isLiked ? 'default' : 'outline'}
              className="group transition-colors"
              disabled={isLikedLoading || isLiking}
            >
              {isLikedLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Heart
                  className={`mr-2 h-4 w-4 transition-transform ${
                    isLiked
                      ? 'fill-white'
                      : 'group-hover:fill-primary group-hover:text-primary'
                  }`}
                />
              )}
              {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
            </Button>

            <Button
              onClick={handleShare}
              variant="ghost"
              className="text-muted-foreground"
            >
              Share
            </Button>
          </div>
        </CardContent>

        <Separator />

        {/* Comments Section */}
        <CardContent className="py-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Comments ({comments.length})
          </h3>

          {/* Comment Submission Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a public comment..."
              className="resize-none mb-3"
              rows={3}
              disabled={isCommenting}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isCommenting || !newComment.trim()}
              >
                {isCommenting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.$id}
                  className="border-b pb-3 last:border-b-0"
                >
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-foreground">
                      {comment.authorName || 'Guest'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {comment.$createdAt
                        ? new Date(comment.$createdAt).toLocaleDateString()
                        : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetails;
