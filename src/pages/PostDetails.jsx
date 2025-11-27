import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Calendar, Heart, User, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Store & Services
import { postService } from '../services/postService';
import { setError } from '../store/postSlice';

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

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Redux Selectors ---
  const { posts, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  // Find the current post in Redux state
  const currentPostFromRedux = posts.find((post) => {
    return post && post.$id !== undefined && String(post.$id) === String(id);
  });

  // --- Local State for Data & UI ---
  const [post, setPost] = useState(currentPostFromRedux || null);
  const [isLoading, setIsLoading] = useState(!currentPostFromRedux);

  // Using likesCount from post collection
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);

  const [isLiked, setIsLiked] = useState(false);

  // NOTE: Comments collection is separate; mock structure for now
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // --- Effect: Load Post Data ---
  useEffect(() => {
    let mounted = true;

    const fetchPost = async () => {
      if (!id) {
        dispatch(setError('No post ID provided.'));
        return;
      }

      // 1. Use cached data
      if (currentPostFromRedux) {
        if (!mounted) return;
        setPost(currentPostFromRedux);

        // Initialize likes state from cached object
        setLikesCount(currentPostFromRedux.likesCount || 0);

        // Determine if the user has liked the post
        if (user?.$id) {
          const likeDoc = await postService.hasUserLiked(
            currentPostFromRedux.$id,
            user.$id,
          );
          if (!mounted) return;
          setIsLiked(!!likeDoc);
        } else {
          setIsLiked(false);
        }

        // NOTE: Initialize comments here if cached posts include comments.

        setIsLoading(false);
        return;
      }

      // 2. Fetch from API
      setIsLoading(true);
      try {
        const fetchedPost = await postService.getPostById(id);

        if (!mounted) return;

        if (fetchedPost) {
          setPost(fetchedPost);

          // Initialize state from fetched object using explicit column names
          setLikesCount(fetchedPost.likesCount || 0);
          // setIsLiked(false);
          // NOTE: Initialize comments here if fetchedPost includes comments.
        } else {
          dispatch(setError('Post not found.'));
        }
      } catch (err) {
        if (mounted) {
          dispatch(
            setError(err.message || 'Failed to load post. Please try again.'),
          );
          console.error('Error details:', err);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchPost();

    return () => {
      mounted = false;
    };
  }, [id, dispatch, currentPostFromRedux, user?.$id]);

  // --- Handlers ---
  const handleLike = async () => {
    if (!user) return toast.error('Login to like');
    if (!post?.$id) return;

    const wasLiked = isLiked;
    const delta = wasLiked ? -1 : 1;

    // optimistic UI
    setIsLiked(!wasLiked);
    setLikesCount((prev) => prev + delta);

    try {
      if (wasLiked) {
        await postService.unlikePost(post.$id, user.$id);
      } else {
        await postService.likePost(post.$id, user.$id);
      }
    } catch (err) {
      // rollback
      setIsLiked(wasLiked);
      setLikesCount((prev) => prev - delta);
      toast.error('Like action failed');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      toast.error('You must be logged in to comment.');
      return;
    }

    setIsCommenting(true);
    const tempId = Date.now();

    const commentData = {
      $id: tempId,
      text: newComment,
      authorName: user.name || 'You',
      $createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setComments((prev) => [commentData, ...prev]);
    setNewComment('');

    try {
      // Assuming postService.addComment exists and returns the permanent comment object
      const actualComment = await postService.addComment(post.$id, newComment);

      // Replace temporary comment with actual data from backend
      setComments((prev) =>
        prev.map((c) => (String(c.$id) === String(tempId) ? actualComment : c)),
      );
      toast.success('Comment posted.');
    } catch (err) {
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
      toast.success('Link copied to clipboard');
    } catch (err) {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();

      try {
        document.execCommand('copy');
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Failed to copy URL');
      }

      document.body.removeChild(el);
    }
  };

  // --- Render States ---

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

  if (error || !post) {
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
                {post.title}
              </CardTitle>

              <CardDescription className="flex items-center space-x-3 text-sm flex-wrap mt-3">
                <Badge
                  variant="secondary"
                  className="font-medium flex items-center gap-1"
                >
                  <User className="h-3.5 w-3.5" /> By{' '}
                  {post.authorName || 'Anonymous'}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={post.$createdAt}>
                    {post.$createdAt
                      ? new Date(post.$createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
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
              {post.content}
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
            >
              <Heart
                className={`mr-2 h-4 w-4 transition-transform ${isLiked ? 'fill-white' : 'group-hover:fill-primary group-hover:text-primary'}`}
              />
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
