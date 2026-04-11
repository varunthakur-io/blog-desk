import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostCard, PostCardSkeleton } from '@/features/posts';
import { EmptyState } from '@/components/common';

const PostGridSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {[...Array(count)].map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </div>
);

const PostGrid = ({ posts }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {posts.map((post) => (
      <PostCard key={post.$id} post={post} />
    ))}
  </div>
);

const ErrorMessage = ({ message }) => (
  <Alert variant="destructive" className="rounded-xl">
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const PrivateTabMessage = ({ children }) => (
  <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center text-sm text-muted-foreground">
    {children}
  </div>
);

const PostCollectionTab = ({
  isPrivate,
  privateMessage,
  isLoading,
  error,
  posts,
  skeletonCount = 3,
  emptyState,
}) => {
  if (isPrivate) return <PrivateTabMessage>{privateMessage}</PrivateTabMessage>;
  if (isLoading) return <PostGridSkeleton count={skeletonCount} />;
  if (error) return <ErrorMessage message={error} />;
  if (posts.length > 0) return <PostGrid posts={posts} />;
  return emptyState;
};

const ProfileTabs = ({
  activeTab,
  setActiveTab,
  isOwner,
  postsLoading,
  postsError,
  userPosts,
  likedPosts,
  isLoadingLikes,
  likesError,
  savedPosts = [],
  isSavedLoading = false,
  savedError = null,
}) => {
  return (
    <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
        <TabsList className="h-9 bg-muted/50 p-1 w-fit rounded-lg border">
          <TabsTrigger value="posts" className="rounded-md text-xs px-6 font-bold uppercase tracking-wider">
            Posts
          </TabsTrigger>
          {isOwner && (
            <>
              <TabsTrigger value="likes" className="rounded-md text-xs px-6 font-bold uppercase tracking-wider">
                Liked
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-md text-xs px-6 font-bold uppercase tracking-wider">
                Saved
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </div>

      {/* Posts Tab */}
      <TabsContent value="posts" className="mt-0 outline-none">
        <PostCollectionTab
          isLoading={postsLoading}
          error={postsError}
          posts={userPosts}
          skeletonCount={6}
          emptyState={
            <EmptyState
              icon={Edit}
              title="No posts yet"
              description={
                isOwner
                  ? 'Share your thoughts with the world.'
                  : "This user hasn't posted anything yet."
              }
              action={
                isOwner && (
                  <Button asChild size="sm" className="rounded-full px-8 shadow-md">
                    <Link to="/create">Write First Post</Link>
                  </Button>
                )
              }
            />
          }
        />
      </TabsContent>

      {/* Likes Tab */}
      <TabsContent value="likes" className="mt-0 outline-none">
        <PostCollectionTab
          isPrivate={!isOwner}
          privateMessage="Liked posts are private."
          isLoading={isLoadingLikes}
          error={likesError}
          posts={likedPosts}
          emptyState={
            <EmptyState
              icon={Heart}
              title="No liked posts"
              description="Posts you like will appear here."
            />
          }
        />
      </TabsContent>

      {/* Saved Tab */}
      <TabsContent value="saved" className="mt-0 outline-none">
        <PostCollectionTab
          isPrivate={!isOwner}
          privateMessage="Saved posts are private."
          isLoading={isSavedLoading}
          error={savedError}
          posts={savedPosts}
          emptyState={
            <EmptyState
              icon={Bookmark}
              title="No saved articles"
              description="Articles you bookmark will appear here."
            />
          }
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
