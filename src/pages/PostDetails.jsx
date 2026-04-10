import { useState } from 'react';
import { ArrowLeft, MessageSquare, Heart, Share2, Calendar, Clock, Loader2, Tag, Pencil } from 'lucide-react';
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
    <div className="page-root min-h-screen bg-background">
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

      <div className="w-full px-4 sm:px-6 lg:px-12 pt-6 pb-20">
        <div className="max-w-screen-xl mx-auto">
          {/* ── Unified Action Bar ── */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border pb-6 mb-10">
            <div className="flex items-center gap-6">
              {/* Back Button Integrated */}
              <button
                onClick={() => navigate(-1)}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-90 group shrink-0"
                title="Back to feed"
              >
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
              </button>

              <div className="flex items-center gap-4">
                <Link to={`/profile/${authorUsername}`} className="shrink-0 transition-transform hover:scale-105 active:scale-95">
                  <Avatar className="h-10 w-10 border border-border shadow-sm">
                    {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                    <AvatarFallback className="bg-muted text-sm font-bold">
                      {authorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Link to={`/profile/${authorUsername}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                      {authorName}
                    </Link>
                    <FollowButton userId={authorProfile?.$id} size="xs" variant="outline" className="h-5 text-[9px] px-2" />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.$createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {estimatedReadTime} min read
                    </span>
                    {post.category && (
                      <button 
                        onClick={handleCategoryClick}
                        className="inline-flex items-center rounded-full bg-secondary/50 px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-wider"
                      >
                        {post.category}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Author-only Edit Button */}
              {authUserId === post.authorId && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 h-9 px-4 gap-2 font-bold text-xs"
                >
                  <Link to={`/edit/${post.$id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
              )}

              <Button
                variant={isLiked ? 'default' : 'ghost'}
                size="sm"
                onClick={handleLike}
                disabled={isLikedLoading || isLiking || !authUserId}
                className={`h-9 rounded-full gap-2 font-bold text-xs ${isLiked ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-sm' : 'text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500'}`}
              >
                {isLiking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />}
                {likesCount}
              </Button>

              <BookmarkButton 
                isBookmarked={isBookmarked} 
                onClick={toggleBookmark} 
                isLoading={isBookmarkLoading}
                className="h-9 w-9 border-none bg-transparent hover:bg-primary/10"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShareOpen(true)}
                className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 h-9 w-9 p-0 flex items-center justify-center"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ── Content Area ── */}
          <div className="min-w-0 pb-16">
            <PostContent
              title={post.title}
              content={post.content}
              coverImageUrl={post.coverImageUrl}
            />

            <Separator className="my-16" />

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
        <button onClick={handleLike} disabled={isLiking} className={`flex items-center gap-2 transition-transform active:scale-125 ${isLiked ? 'text-rose-500' : 'text-muted-foreground'}`}>
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
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
