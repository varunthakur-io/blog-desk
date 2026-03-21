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
              (!isAuthorized
                ? 'This post is private.'
                : 'The article you are looking for does not exist.')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/')} variant="outline" className="rounded-full gap-2 mt-2">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="page-root max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
        {/* Main content — takes up most of the width */}
        <div className="flex-1 min-w-0 space-y-10">
          <PostContent
            title={post.title}
            content={post.content}
            coverImageUrl={post.coverImageUrl}
            category={post.category}
          />
          <Separator />
          <CommentSection
            postId={post.$id}
            authUserId={authUserId}
            currentUserProfile={currentUserProfile}
            initialComments={comments}
            profiles={profileCache}
          />
        </div>

        {/* Sidebar — fixed width on desktop */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
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
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;

