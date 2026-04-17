import { useState } from 'react';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  PostDetailsSkeleton,
  PostContent,
  setActiveCategory,
  PostAuthorBar,
  PostFloatingActions,
} from '@/features/posts';

import { CommentSection } from '@/features/comments';
import { useBookmark } from '@/features/bookmarks';
import { usePostDetails } from '@/features/posts';
import { SEO, ShareDialog } from '@/components/common';
import NotFound from './NotFound';
import { formatDate } from '@/utils/formatters';

/**
 * Detailed view of a single blog post.
 */
const PostDetails = () => {
  const dispatch = useDispatch();
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const {
    authUserId,
    post,
    authorProfile,
    currentUserProfile,
    isPostLoading,
    postFetchError,
    likesCount,
    isLiked,
    isLikedLoading,
    isLiking,
    comments,
    estimatedReadTime,
    handleLike,
    navigate,
  } = usePostDetails();

  const {
    isBookmarked,
    isLoading: isBookmarkLoading,
    toggleBookmark,
  } = useBookmark(post || {});

  if (isPostLoading) return <PostDetailsSkeleton />;

  const isNotFound = 
    postFetchError?.toLowerCase().includes('not found') || 
    postFetchError?.toLowerCase().includes('404') ||
    (!post && !isPostLoading);

  if (isNotFound) {
    return <NotFound />;
  }

  const isAuthorized = post?.status === 'published' || post?.authorId === authUserId;

  if (postFetchError || !post || !isAuthorized) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <Alert variant="destructive" className="rounded-md">
          <AlertDescription>
            {postFetchError ||
              (!isAuthorized ? 'This post is private.' : 'This post does not exist.')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/')} variant="outline" className="mt-2 gap-2 rounded-md font-bold text-xs uppercase tracking-widest border-border/40">
          <ArrowLeft className="size-4" /> Back to Home
        </Button>
      </div>
    );
  }

  const handleCategoryClick = () => {
    if (post.category) {
      dispatch(setActiveCategory(post.category));
      navigate('/');
    }
  };

  const handleCommentsClick = () => {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <article className="animate-in fade-in py-10 lg:py-16 space-y-12 duration-700">
      <SEO
        title={post.title}
        description={post.content?.substring(0, 160).replace(/<[^>]*>/g, '')}
        image={post.coverImageUrl}
        url={`/posts/${post.slug}`}
        type="article"
        author={authorProfile?.name || 'Anonymous'}
        publishedTime={post.$createdAt}
        category={post.category}
      />

      <ShareDialog 
        open={isShareOpen} 
        onOpenChange={setIsShareOpen} 
        url={`/posts/${post.slug}`} 
        title={post.title} 
      />

      <div className="w-full max-w-[800px] mx-auto">
        <header className="space-y-10 pb-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {post.category && (
                <button 
                  onClick={handleCategoryClick}
                  className="rounded-md bg-muted/50 border border-border/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-muted-foreground transition-all hover:bg-foreground hover:text-background"
                >
                  {post.category}
                </button>
              )}
              <div className="h-3 w-px bg-border/40" aria-hidden="true" />
              <time className="text-[12px] font-bold text-muted-foreground/40 tabular-nums">
                {formatDate(post.$createdAt, { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <div className="h-3 w-px bg-border/40" aria-hidden="true" />
              <span className="text-[12px] font-bold text-muted-foreground/40 tabular-nums">
                {estimatedReadTime} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tighter text-foreground font-sans">
              {post.title}
            </h1>

            <PostAuthorBar 
              authorProfile={authorProfile}
              authUserId={authUserId}
              post={post}
              isBookmarked={isBookmarked}
              toggleBookmark={toggleBookmark}
              isBookmarkLoading={isBookmarkLoading}
              onShareClick={() => setIsShareOpen(true)}
            />
          </div>
        </header>

        <PostContent content={post.content} coverImageUrl={post.coverImageUrl} />

        <footer id="comments" className="mt-20 flex flex-col gap-12 pb-20">
          <div className="flex items-center justify-between border-t border-border/20 pt-10">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                onClick={handleLike}
                disabled={isLikedLoading || isLiking || !authUserId}
                className={cn(
                  "h-10 gap-2 rounded-md px-6 text-[13px] font-bold tracking-tight transition-all active:scale-95",
                  isLiked 
                    ? "bg-foreground text-background border-none hover:opacity-90" 
                    : "border border-border/40 text-muted-foreground hover:bg-rose-500/5 hover:text-rose-500 hover:border-rose-500/20"
                )}
              >
                {isLiking ? <Loader2 className="size-3.5 animate-spin" /> : <Heart className={cn("size-4", isLiked && "fill-current")} />}
                {likesCount} Like
              </Button>
            </div>
            {/* Share button etc */}
          </div>

          <Separator className="opacity-20" />

          <CommentSection
            postId={post.$id}
            authUserId={authUserId}
            currentUserProfile={currentUserProfile}
            initialComments={comments}
          />
        </footer>
      </div>

      <PostFloatingActions 
        isLiked={isLiked}
        likesCount={likesCount}
        commentsCount={comments.length}
        handleLike={handleLike}
        isLiking={isLiking}
        onShareClick={() => setIsShareOpen(true)}
        onCommentsClick={handleCommentsClick}
      />
    </article>
  );
};

export default PostDetails;
