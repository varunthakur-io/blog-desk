import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  PostDetailsSkeleton,
  PostContent,
  CommentSection,
  AuthorSidebar,
} from '@/components/posts';

import { usePostDetails } from '@/hooks/posts/usePostDetails';

const PostDetails = () => {
  const {
    authUserId,
    post,
    profileCache,
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
    handleShare,
    navigate,
  } = usePostDetails();

  if (isPostLoading) return <PostDetailsSkeleton />;

  const isAuthorized = post?.status === 'published' || post?.authorId === authUserId;

  if (postFetchError || !post || !isAuthorized) {
    return (
      <div className="py-20 flex flex-col items-center gap-4 text-center max-w-md mx-auto">
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

  return (
    <div className="page-root">

      {/* 2-column grid — left sidebar fixed, right content scrolls independently */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-0 lg:gap-8 xl:gap-12">

        {/* ── Left sidebar — fixed height, doesn't scroll ── */}
        <div className="hidden lg:block">
          <div className="sticky top-[calc(64px+2rem)] h-[calc(100vh-64px-4rem)] overflow-hidden scrollbar-none pr-6 relative">
            {/* vertical fading line — exactly like shadcn docs */}
            <div className="absolute top-0 right-0 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />
            <AuthorSidebar
              authorProfile={authorProfile}
              createdAt={post.$createdAt}
              readTime={estimatedReadTime}
              likesCount={likesCount}
              isLiked={isLiked}
              isLikedLoading={isLikedLoading}
              isLiking={isLiking}
              handleLike={handleLike}
              handleShare={handleShare}
              category={post.category}
              commentsCount={comments.length}
              authUserId={authUserId}
              onBack={() => navigate(-1)}
            />
          </div>
        </div>

        {/* ── Center — scrollable content column ── */}
        <div className="min-w-0 pb-10">
          <PostContent
            title={post.title}
            content={post.content}
            coverImageUrl={post.coverImageUrl}
            category={post.category}
          />

          <Separator className="my-10" />

          <CommentSection
            postId={post.$id}
            authUserId={authUserId}
            currentUserProfile={currentUserProfile}
            initialComments={comments}
            profiles={profileCache}
          />
        </div>

        {/* ── Right sidebar — removed, article gets full width ── */}

      </div>

      {/* mobile: like + share bar fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          By <span className="font-medium text-foreground">{authorProfile?.name || 'Anonymous'}</span>
          {' · '}{estimatedReadTime} min read
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleLike}
            variant={isLiked ? 'default' : 'outline'}
            size="sm"
            className={`gap-1.5 rounded-full text-xs px-3 ${isLiked ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500' : ''}`}
            disabled={isLikedLoading || isLiking || !authUserId}
          >
            {likesCount}
          </Button>
          <Button onClick={handleShare} variant="outline" size="sm" className="gap-1.5 rounded-full text-xs px-3">
            Share
          </Button>
        </div>
      </div>
      <div className="lg:hidden h-20" />

    </div>
  );
};

export default PostDetails;
