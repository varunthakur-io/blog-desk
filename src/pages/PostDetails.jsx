import { useState } from 'react';
import { ArrowLeft, MessageSquare, Heart, Share2, Pencil, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  PostDetailsSkeleton,
  PostContent,
  setActiveCategory,
} from '@/features/posts';

import { CommentSection } from '@/features/comments';
import { FollowButton } from '@/features/follows';
import { BookmarkButton, useBookmark } from '@/features/bookmarks';

import { usePostDetails } from '@/features/posts';
import { SEO, ShareDialog } from '@/components/common';
import NotFound from './NotFound';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

/**
 * Detailed view of a single blog post.
 * Redesigned for a High-End 'Shadcn Zen' editorial experience.
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

  const authorName = authorProfile?.name || 'Anonymous';
  const authorAvatar = authorProfile?.avatarUrl;
  const authorUsername = authorProfile?.username;

  return (
    <article className="animate-in fade-in py-10 lg:py-16 space-y-12 duration-700">
      <SEO
        title={post.title}
        description={post.content?.substring(0, 160).replace(/<[^>]*>/g, '')}
        image={post.coverImageUrl}
        url={`/posts/${post.slug}`}
        type="article"
        author={authorName}
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
        {/* Post Header */}
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
              <div className="h-3 w-[1px] bg-border/40" aria-hidden="true" />
              <time 
                className="text-[12px] font-bold text-muted-foreground/40 tabular-nums"
                dateTime={post.$createdAt}
              >
                {formatDate(post.$createdAt, { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <div className="h-3 w-[1px] bg-border/40" aria-hidden="true" />
              <span className="text-[12px] font-bold text-muted-foreground/40 tabular-nums">
                {estimatedReadTime} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tighter text-foreground font-sans">
              {post.title}
            </h1>

            {/* Author Bar */}
            <div className="flex items-center justify-between border-y border-border/20 py-8">
              <div className="flex items-center gap-4">
                <Link to={`/profile/${authorUsername}`} className="shrink-0">
                  <Avatar className="size-10 border-none bg-muted ring-1 ring-border/20 shadow-sm transition-all hover:ring-primary/20">
                    {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                    <AvatarFallback className="bg-muted text-sm font-bold uppercase text-muted-foreground">
                      {authorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${authorUsername}`} className="text-[15px] font-bold text-foreground hover:text-primary transition-colors tracking-tight">
                      {authorName}
                    </Link>
                    <FollowButton 
                      userId={authorProfile?.$id} 
                      size="sm" 
                      variant="ghost" 
                      showIcon={false}
                      className="h-6 border border-border/40 px-3 text-[10px] font-bold uppercase tracking-tight rounded-md hover:bg-foreground hover:text-background transition-all" 
                    />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground/50 tracking-tight">
                    Author · {authorProfile?.bio?.substring(0, 40) || 'Verified Writer'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <BookmarkButton 
                  isBookmarked={isBookmarked} 
                  onClick={toggleBookmark} 
                  isLoading={isBookmarkLoading}
                  className="size-9 rounded-md border-none bg-transparent hover:bg-muted/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsShareOpen(true)}
                  className="size-9 rounded-md text-muted-foreground hover:bg-muted/50"
                  aria-label="Share story"
                >
                  <Share2 className="size-4" />
                </Button>
                {authUserId === post.authorId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="size-9 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Edit story"
                  >
                    <Link to={`/edit/${post.$id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <PostContent
          title="" 
          content={post.content}
          coverImageUrl={post.coverImageUrl}
        />

        {/* Detailed Post Interactions */}
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

              <div className="flex items-center gap-2 text-[13px] font-bold text-muted-foreground/60 tracking-tight">
                <MessageSquare className="size-4" />
                {comments.length} Comments
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 hidden sm:block">
                Spread the word
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsShareOpen(true)} 
                className="size-10 rounded-md border-border/40 shadow-sm transition-all active:scale-95 hover:bg-muted"
              >
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          <Separator className="opacity-20" />

          {/* Comment Section Redesigned in Sidebar-style if it was separate, but here it's inline */}
          <CommentSection
            postId={post.$id}
            authUserId={authUserId}
            currentUserProfile={currentUserProfile}
            initialComments={comments}
          />
        </footer>
      </div>

      {/* Floating Modern Tab Bar (Compact App-feel) */}
      <nav className="fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-6 rounded-lg border border-border/40 bg-background/80 px-6 py-3 shadow-2xl shadow-primary/10 backdrop-blur-xl transition-all duration-300 lg:hidden group">
        <button 
          onClick={handleLike} 
          disabled={isLiking} 
          className={cn("flex items-center gap-2 transition-all active:scale-125", isLiked ? "text-rose-500" : "text-muted-foreground hover:text-foreground")}
          aria-label="Like"
        >
          <Heart className={cn("size-5", isLiked && "fill-current")} />
          <span className="text-sm font-bold tabular-nums">{likesCount}</span>
        </button>
        <div className="h-4 w-[1px] bg-border/40" aria-hidden="true" />
        <button 
          onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })} 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all"
          aria-label="Comments"
        >
          <MessageSquare className="size-5" />
          <span className="text-sm font-bold tabular-nums">{comments.length}</span>
        </button>
        <div className="h-4 w-[1px] bg-border/40" aria-hidden="true" />
        <button 
          onClick={() => setIsShareOpen(true)} 
          className="text-muted-foreground hover:text-foreground transition-all"
          aria-label="Share"
        >
          <Share2 className="size-5" />
        </button>
      </nav>
    </article>
  );
};

export default PostDetails;
