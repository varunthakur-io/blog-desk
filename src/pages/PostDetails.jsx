// PostDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  Share2,
  Loader2,
} from 'lucide-react';

// UI Components
import PostDetailsSkeleton from '@/components/skeletons/PostDetailsSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

// Store & Services
import { postService } from '@/services/postService';
import { authService } from '@/services/authService';
import { appendPosts, selectPostById } from '@/store/postSlice';
import { selectAuthUserId } from '@/store/authSlice';
import { selectProfileById, upsertProfile } from '@/store/profileSlice';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Post & User State from Redux
  const currentPost = useSelector((state) => selectPostById(state, id));
  const authUserId = useSelector(selectAuthUserId);
  const profiles = useSelector((state) => state.profile.byId);

  // Current User Profile (for commenting)
  const currentUserProfile = useSelector((state) =>
    selectProfileById(state, authUserId),
  );
  const currentUserName = currentUserProfile?.name;

  // Author Profile State
  // We select the profile using the authorId from the post
  const authorProfile = useSelector((state) =>
    selectProfileById(state, currentPost?.authorId),
  );

  // Local States
  const [isLoading, setIsLoading] = useState(!currentPost);
  const [error, setError] = useState('');

  // Likes
  const [likesCount, setLikesCount] = useState(currentPost?.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikedLoading, setIsLikedLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  // Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // Calculate read time
  const readTime = currentPost?.content
    ? Math.max(1, Math.ceil(currentPost.content.split(' ').length / 200))
    : 1;

  // Effect 1: Fetch Post Data & Author Profile
  useEffect(() => {
    if (!id) {
      setError('No post ID provided.');
      return;
    }

    // If post is already in store, just ensure loading is false and check for author profile
    if (currentPost) {
      setIsLoading(false);

      // If we have the post but NOT the author profile, fetch the profile
      if (currentPost.authorId && !authorProfile) {
        authService
          .getProfile(currentPost.authorId)
          .then((profile) => dispatch(upsertProfile(profile)))
          .catch((err) => console.warn('Could not fetch author profile:', err));
      }
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

          // Fetch author profile immediately after fetching post
          if (fetchedPost.authorId) {
            authService
              .getProfile(fetchedPost.authorId)
              .then((profile) => {
                if (mounted) dispatch(upsertProfile(profile));
              })
              .catch((err) =>
                console.warn('Could not fetch author profile:', err),
              );
          }
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
  }, [id, dispatch, currentPost?.authorId]);

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
        setComments(fetchedComments);
      } catch (err) {
        console.error('Failed to load comments', err.message);
      }
    };

    fetchComments();
  }, [currentPost?.$id]);

  // Effect: Load commenter profiles when comments are fetched
  useEffect(() => {
    if (comments.length === 0) return;

    comments.forEach((comment) => {
      if (comment.userId && !profiles[comment.userId]) {
        authService
          .getProfile(comment.userId)
          .then((profile) => {
            dispatch(upsertProfile(profile));
          })
          .catch((err) =>
            console.warn('Could not fetch commenter profile:', err),
          );
      }
    });
  }, [comments, dispatch, profiles]);

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
      content,
      $createdAt: new Date().toISOString(),
    };

    // Add optimistically
    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment('');

    try {
      const createdComment = await postService.addComment({
        postId: currentPost.$id,
        userId: authUserId,
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

  // Share Handler
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

  // Determine what to show for author info
  // Use profile data if available, otherwise fallback to post data
  const displayAuthorName = authorProfile?.name || 'Anonymous';
  const displayAuthorBio = authorProfile?.bio;
  const displayAuthorAvatar = authorProfile?.avatarUrl;

  const postImageURL = currentPost?.postImageURL || null;

  // Privacy Check: Only show if published OR if the current user is the author
  // We use strict equality for published to handle potential undefined cases gracefully (though DB should have it)
  const isAuthorized =
    currentPost?.published === true || currentPost?.authorId === authUserId;

  if (error || !currentPost || !isAuthorized) {
    return (
      <div className="py-10">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {error ||
                    (!isAuthorized
                      ? 'This post is private.'
                      : 'The article you are looking for does not exist.')}
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
    <div className="bg-background">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Main Content (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Article Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-sm font-medium"
                >
                  {currentPost.category || 'Article'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-muted-foreground hover:text-foreground h-auto py-1 px-3 rounded-full hover:bg-muted/50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                {currentPost.title}
              </h1>
            </div>

            {/* Hero Image */}
            {postImageURL && (
              <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-muted border shadow-sm">
                <img
                  src={postImageURL}
                  alt={currentPost.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Body */}
            <article className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-justify">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(currentPost.content),
                }}
              />
            </article>

            <Separator />

            {/* Comments Section */}
            <div className="space-y-8 pt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">
                  Discussion
                </h3>
                <Badge variant="secondary" className="rounded-full px-3">
                  {comments.length} comments
                </Badge>
              </div>

              {/* Comment Form */}
              <Card className="border-dashed shadow-sm bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      {/* Use currentUserProfile for the comment input avatar if available */}
                      {currentUserProfile?.avatarUrl ? (
                        <AvatarImage src={currentUserProfile.avatarUrl} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {currentUserName?.[0]?.toUpperCase() || 'U'}
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
                        {newComment && (
                          <Button
                            variant="ghost"
                            onClick={() => setNewComment('')}
                            disabled={isCommenting}
                          >
                            Cancel
                          </Button>
                        )}
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

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  comments.map((comment) => {
                    const commenterProfile = profiles[comment.userId];
                    const name = commenterProfile?.name;
                    const avatarUrl = commenterProfile?.avatarUrl;
                    const commentorInitial = name?.[0]?.toUpperCase() || 'G';

                    return (
                      <div
                        key={comment.$id}
                        className="group flex gap-4 transition-all"
                      >
                        <Avatar className="h-10 w-10 border border-muted bg-background mt-1">
                          <AvatarImage src={avatarUrl} alt={name} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground font-medium text-xs">
                            {commentorInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-card border rounded-2xl p-4 shadow-sm relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm">
                                {name}
                              </span>
                              <time className="text-xs text-muted-foreground">
                                {comment.$createdAt
                                  ? new Date(
                                      comment.$createdAt,
                                    ).toLocaleDateString('en-US', {
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
          </div>

          {/* RIGHT COLUMN: Sidebar (4/12) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Author Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                      {displayAuthorAvatar ? (
                        <AvatarImage
                          src={displayAuthorAvatar}
                          alt={displayAuthorName}
                        />
                      ) : null}
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {displayAuthorName?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">{displayAuthorName}</h3>
                      {displayAuthorBio && (
                        <p className="text-sm text-muted-foreground max-w-[200px] line-clamp-2">
                          {displayAuthorBio}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">Author</p>
                    </div>

                    {currentPost.authorId && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full rounded-full mt-4"
                      >
                        <Link to={`/profile/${currentPost.authorId}`}>
                          View Profile
                        </Link>
                      </Button>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Published
                      </span>
                      <span className="font-medium">
                        {new Date(currentPost.$createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Read time
                      </span>
                      <span className="font-medium">{readTime} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleLike}
                      variant={isLiked ? 'default' : 'secondary'}
                      className={`w-full justify-center ${isLiked ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                      disabled={isLikedLoading || isLiking}
                    >
                      {isLiking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Liking...
                        </>
                      ) : (
                        <>
                          <Heart
                            className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                          />
                          {likesCount}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full"
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
