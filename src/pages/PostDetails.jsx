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
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
        <div className="lg:col-span-8 space-y-10">
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

        <div className="lg:col-span-4">
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
