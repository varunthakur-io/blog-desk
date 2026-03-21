import { ArrowLeft } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

import {
  PostDetailsSkeleton,
  PostContent,
  CommentSection,
  AuthorSidebar,
} from '@/components/posts';

// Hooks
import { usePostDetails } from '@/hooks/posts/usePostDetails';

const PostDetails = () => {
  const {
    // routing / identity
    authUserId,

    // cached entities
    currentPost,
    profiles,
    authorProfile,
    currentUserProfile,

    // loading and errors
    isLoading,
    error,

    // interaction state
    likesCount,
    isLiked,
    isLikedLoading,
    isLiking,

    // post content
    comments,
    readTime,

    // actions
    handleLike,
    handleShare,
    navigate,
  } = usePostDetails();

  if (isLoading) return <PostDetailsSkeleton />;

  const isAuthorized = currentPost?.status === 'published' || currentPost?.authorId === authUserId;

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
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <PostContent
            title={currentPost.title}
            content={currentPost.content}
            coverImageUrl={currentPost.coverImageUrl}
          />
          <Separator />
          <CommentSection
            postId={currentPost.$id}
            authUserId={authUserId}
            currentUserProfile={currentUserProfile}
            initialComments={comments}
            profiles={profiles}
          />
        </div>

        <div className="lg:col-span-4">
          <AuthorSidebar
            authorProfile={authorProfile}
            createdAt={currentPost.$createdAt}
            readTime={readTime}
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
