import { useState } from 'react';
import { ArrowLeft, MessageSquare, Heart, Share2, Calendar, Clock, Loader2, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
      <div className="py-20 flex flex-col items-center gap-4 text-center max-w-md mx-auto px-4">
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>
            {postFetchError ||
              (!isAuthorized ? 'This post is private.' : 'This post does not exist.')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/')} variant="outline" className="rounded-full gap-2 mt-2">
          <ArrowLeft className="h-4 w-4" /> Back to Home
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
    <div className="min-h-screen bg-background">
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

      <div className="w-full pb-20 animate-in fade-in duration-700">
        {/* Header/Hero Section */}
        <div className="w-full pt-2 pb-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              {post.category && (
                <button 
                  onClick={handleCategoryClick}
                  className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.15em] hover:bg-primary/10 transition-colors"
                >
                  {post.category}
                </button>
              )}
              <div className="h-4 w-px bg-border/60" />
              <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
                {formatDate(post.$createdAt)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.05] text-foreground">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-y border-border/40 py-6">
              <div className="flex items-center gap-4">
                <Link to={`/profile/${authorUsername}`} className="shrink-0 group">
                  <Avatar className="h-12 w-12 border-2 border-border shadow-sm group-hover:ring-4 group-hover:ring-primary/5 transition-all">
                    {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                    <AvatarFallback className="bg-muted text-lg font-black uppercase text-muted-foreground">
                      {authorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${authorUsername}`} className="text-base font-bold text-foreground hover:underline decoration-primary/30">
                      {authorName}
                    </Link>
                    <FollowButton 
                      userId={authorProfile?.$id} 
                      size="sm" 
                      variant="ghost" 
                      showIcon={false}
                      className="h-7 px-3 text-[12px] font-black uppercase tracking-wider text-primary hover:bg-primary/5 hover:text-primary border border-primary/20 transition-all" 
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground/50 font-bold uppercase tracking-widest italic">
                    {estimatedReadTime} min read · Published in {post.category || 'General'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <BookmarkButton 
                  isBookmarked={isBookmarked} 
                  onClick={toggleBookmark} 
                  isLoading={isBookmarkLoading}
                  className="h-10 w-10 border-none bg-transparent hover:bg-primary/5 rounded-full"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsShareOpen(true)}
                  className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                  <Share2 className="h-4.5 w-4.5" />
                </Button>
                {authUserId === post.authorId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Link to={`/edit/${post.$id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body (Focused width for better reading experience) */}
        <div className="max-w-[800px] mx-auto">
          <PostContent
            title="" // Title is handled in the hero section now
            content={post.content}
            coverImageUrl={post.coverImageUrl}
          />

          {/* Bottom Actions */}
          <div className="mt-20 flex flex-col gap-12">
            <div className="flex items-center justify-between border-t border-border/40 pt-10">
              <div className="flex items-center gap-6">
                <Button
                  variant={isLiked ? 'default' : 'ghost'}
                  onClick={handleLike}
                  disabled={isLikedLoading || isLiking || !authUserId}
                  className={cn(
                    "h-12 rounded-full gap-3 font-black text-xs uppercase tracking-widest px-6 transition-all active:scale-95",
                    isLiked 
                      ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20" 
                      : "text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 border border-border/40"
                  )}
                >
                  {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />}
                  {likesCount}
                </Button>

                <button 
                  onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold text-xs uppercase tracking-widest"
                >
                  <MessageSquare className="h-5 w-5" />
                  {comments.length} comments
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] hidden sm:block mr-2 text-right">Share this story</span>
                <Button variant="outline" size="icon" onClick={() => setIsShareOpen(true)} className="rounded-full h-10 w-10 border-border/60 hover:bg-muted transition-all active:scale-95 shadow-sm">
                  <Share2 className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>

            <Separator className="opacity-40" />

            {/* ── Comments Section ── */}
            <CommentSection
              postId={post.$id}
              authUserId={authUserId}
              currentUserProfile={currentUserProfile}
              initialComments={comments}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-background/80 backdrop-blur-xl border border-border/50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 transition-all duration-300">
        <button onClick={handleLike} disabled={isLiking} className={cn("flex items-center gap-2 transition-transform active:scale-125", isLiked ? "text-rose-500" : "text-muted-foreground")}>
          <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
          <span className="text-sm font-bold">{likesCount}</span>
        </button>
        <div className="w-px h-4 bg-border" />
        <button onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm font-bold">{comments.length}</span>
        </button>
        <div className="w-px h-4 bg-border" />
        <button onClick={() => setIsShareOpen(true)} className="text-muted-foreground">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PostDetails;
