// PostDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Calendar,
  Heart,
  User,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// UI Components
import PostDetailsSkeleton from '@/components/skeletons/PostDetailsSkeleton';
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
  const authUserName = useSelector((state) =>
    selectProfileById(state, authUserId),
  )?.name;

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

  // Effect 2: Handle Likes State
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

  // Effect 3: Fetch Comments
  useEffect(() => {
    if (!currentPost?.$id) return;

    const fetchComments = async () => {
      try {
        const fetchedComments = await postService.getCommentsByPost(
          currentPost.$id,
        );
        console.log('Fetched comments:', fetchedComments);
        setComments(fetchedComments);
      } catch (err) {
        console.error('Failed to load comments', err.message);
      }
    };

    fetchComments();
  }, [currentPost?.$id]);

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

  // Comment Submission Handler
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content || !currentPost?.$id || !authUserId) return;

    setIsCommenting(true);

    // Optimistic comment (with temporary ID)
    const tempId = 'temp-' + Date.now();
    const optimisticComment = {
      $id: tempId,
      postId: currentPost.$id,
      userId: authUserId,
      authorName: authUserName || 'Anonymous',
      content,
      $createdAt: new Date().toISOString(),
    };

    // Add optimistically
    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment('');

    try {
      // Send to server
      const createdComment = await postService.addComment({
        postId: currentPost.$id,
        userId: authUserId,
        authorName: authUserName || 'Anonymous',
        content,
      });

      // Replace temp with real comment
      setComments((prev) =>
        prev.map((c) => (c.$id === tempId ? createdComment : c)),
      );
      toast.success('Comment posted!');
    } catch (err) {
      // Remove failed comment
      setComments((prev) => prev.filter((c) => c.$id !== tempId));
      setNewComment(content);
      toast.error('Failed to post comment', err.message);
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
    return <PostDetailsSkeleton />;
  }

  if (error || !currentPost) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card className="p-0 border-none shadow-none">
        <CardHeader className="border-0 pb-4 px-0">
          <div className="flex justify-between items-start px-4 sm:px-6 lg:px-8">
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
        <CardContent className="pt-6 px-0">
          <div className="prose prose-lg max-w-none dark:prose-invert px-4 sm:px-6 lg:px-8">
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-justify">
              {currentPost.content}
            </p>
          </div>
        </CardContent>

        <Separator />

        {/* Like and Share Actions */}
        <CardContent className="py-4 px-0">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
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
                    className="mr-2 h-4 w-4 transition-all"
                    fill={isLiked ? 'red' : 'transparent'}
                    stroke={isLiked ? 'red' : 'currentColor'}
                    strokeWidth={2}
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
          </div>
        </CardContent>

        <Separator />

        {/* Comments Section – restyled to match your theme */}
        <CardContent className="py-4 px-0 ">
          <div className="flex flex-col  px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center border-2-b pb-4 mb-6 justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {comments.length}{' '}
                  {comments.length === 1 ? 'comment' : 'comments'}
                </h3>
              </div>
            </div>

            {/* Comment Form */}
            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm">
                  {authUserName?.[0]?.toUpperCase() || 'U'}
                </div>

                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="resize-none bg-background/60 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/60 placeholder:text-muted-foreground/60 min-h-[80px]"
                    rows={3}
                    disabled={isCommenting}
                  />
                  <div className="flex justify-end mt-3">
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={isCommenting || !newComment.trim()}
                      className="rounded px-3"
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
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-border/60 bg-muted/30">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-muted/60 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No comments yet. Be the first to share your thoughts.
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.$id} className="flex gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm">
                      {comment.authorName?.[0]?.toUpperCase() || 'G'}
                    </div>

                    {/* Comment Bubble */}
                    <div className="flex-1">
                      <div className="rounded-md bg-card/80 border border-border/60 px-4 py-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-semibold text-sm text-foreground">
                            {comment.authorName || 'Guest'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <time className="text-xs text-muted-foreground">
                            {comment.$createdAt
                              ? new Date(comment.$createdAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                  },
                                )
                              : 'Just now'}
                          </time>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetails;
