import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostCard, PostCardSkeleton } from '@/features/posts';
import { EmptyState } from '@/components/common';

const PostListSkeleton = ({ count = 3 }) => (
  <div className="-mx-4 flex flex-col gap-0 px-4">
    {[...Array(count)].map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </div>
);

const PostList = ({ posts }) => (
  <section className="-mx-4 flex flex-col gap-0 px-4">
    {posts.map((post) => (
      <PostCard key={post.$id} post={post} />
    ))}
  </section>
);

const ErrorMessage = ({ message }) => (
  <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 mx-4 rounded-xl">
    <AlertDescription className="text-xs font-bold tracking-widest uppercase">
      {message}
    </AlertDescription>
  </Alert>
);

const PrivateTabMessage = ({ children }) => (
  <article className="border-border/60 bg-muted/10 mx-4 rounded-2xl border border-dashed py-20 text-center">
    <div className="mx-auto max-w-xs space-y-3">
      <div className="bg-muted mx-auto flex size-12 items-center justify-center rounded-full opacity-50">
        <Bookmark className="text-muted-foreground size-5" />
      </div>
      <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
        {children}
      </p>
    </div>
  </article>
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
  if (isLoading) return <PostListSkeleton count={skeletonCount} />;
  if (error) return <ErrorMessage message={error} />;
  if (posts.length > 0) return <PostList posts={posts} />;
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
      <div className="border-border/40 bg-background/95 sticky top-16 z-30 -mx-4 mb-4 border-b px-4 backdrop-blur-md">
        <TabsList className="flex h-12 w-fit items-end gap-8 rounded-none border-none bg-transparent p-0">
          <TabsTrigger
            value="posts"
            className="data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-0 pb-4 text-[14px] font-bold tracking-tight transition-all duration-300 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Posts
          </TabsTrigger>
          {isOwner && (
            <>
              <TabsTrigger
                value="likes"
                className="data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-0 pb-4 text-[14px] font-bold tracking-tight transition-all duration-300 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Likes
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-0 pb-4 text-[14px] font-bold tracking-tight transition-all duration-300 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Saved
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </div>

      {/* Posts Tab */}
      <TabsContent
        value="posts"
        className="animate-in fade-in slide-in-from-bottom-2 mt-0 duration-500 outline-none"
      >
        <PostCollectionTab
          isLoading={postsLoading}
          error={postsError}
          posts={userPosts}
          skeletonCount={4}
          emptyState={
            <div className="px-4 py-10">
              <EmptyState
                className="border-none bg-transparent"
                icon={Edit}
                title="No posts yet"
                description={
                  isOwner
                    ? 'Share your thoughts with the world and start your writing journey.'
                    : "This user hasn't posted anything yet. Check back later!"
                }
                action={
                  isOwner && (
                    <Button
                      asChild
                      className="bg-foreground text-background h-9 rounded-md px-8 text-xs font-bold shadow-sm transition-all hover:opacity-90"
                    >
                      <Link to="/create">Write First Post</Link>
                    </Button>
                  )
                }
              />
            </div>
          }
        />
      </TabsContent>

      {/* Likes Tab */}
      <TabsContent
        value="likes"
        className="animate-in fade-in slide-in-from-bottom-2 mt-0 duration-500 outline-none"
      >
        <PostCollectionTab
          isPrivate={!isOwner}
          privateMessage="Liked posts are private."
          isLoading={isLoadingLikes}
          error={likesError}
          posts={likedPosts}
          emptyState={
            <div className="px-4 py-10">
              <EmptyState
                className="border-none bg-transparent"
                icon={Heart}
                title="No liked posts"
                description="Posts you like will appear here for quick access."
              />
            </div>
          }
        />
      </TabsContent>

      {/* Saved Tab */}
      <TabsContent
        value="saved"
        className="animate-in fade-in slide-in-from-bottom-2 mt-0 duration-500 outline-none"
      >
        <PostCollectionTab
          isPrivate={!isOwner}
          privateMessage="Saved posts are private."
          isLoading={isSavedLoading}
          error={savedError}
          posts={savedPosts}
          emptyState={
            <div className="px-4 py-10">
              <EmptyState
                className="border-none bg-transparent"
                icon={Bookmark}
                title="No saved articles"
                description="Articles you bookmark will appear here so you can read them later."
              />
            </div>
          }
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
