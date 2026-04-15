import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostCard, PostCardSkeleton } from '@/features/posts';
import { EmptyState } from '@/components/common';

const PostListSkeleton = ({ count = 3 }) => (
  <div className="flex flex-col gap-10">
    {[...Array(count)].map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </div>
);

const PostList = ({ posts }) => (
  <div className="flex flex-col gap-2">
    {posts.map((post) => (
      <PostCard key={post.$id} post={post} />
    ))}
  </div>
);

const ErrorMessage = ({ message }) => (
  <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
    <AlertDescription className="font-bold text-xs uppercase tracking-widest">{message}</AlertDescription>
  </Alert>
);

const PrivateTabMessage = ({ children }) => (
  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 py-20 text-center">
    <div className="max-w-xs mx-auto space-y-3">
       <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto opacity-50">
          <Bookmark className="size-5 text-muted-foreground" />
       </div>
       <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{children}</p>
    </div>
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
      <div className="flex items-center justify-between mb-10 border-b border-border/40">
        <TabsList className="h-auto bg-transparent p-0 w-fit rounded-none border-none gap-8">
          <TabsTrigger 
            value="posts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[13px] px-0 pb-4 font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all"
          >
            Posts
          </TabsTrigger>
          {isOwner && (
            <>
              <TabsTrigger 
                value="likes" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[13px] px-0 pb-4 font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all"
              >
                Liked
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[13px] px-0 pb-4 font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all"
              >
                Saved
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </div>

      {/* Posts Tab */}
      <TabsContent value="posts" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
        <PostCollectionTab
          isLoading={postsLoading}
          error={postsError}
          posts={userPosts}
          skeletonCount={4}
          emptyState={
            <div className="py-10">
              <EmptyState
                className="bg-transparent border-none"
                icon={Edit}
                title="No posts yet"
                description={
                  isOwner
                    ? 'Share your thoughts with the world and start your writing journey.'
                    : "This user hasn't posted anything yet. Check back later!"
                }
                action={
                  isOwner && (
                    <Button asChild className="rounded-full px-8 shadow-md font-black text-xs uppercase tracking-widest h-11 bg-primary">
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
      <TabsContent value="likes" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
        <PostCollectionTab
          isPrivate={!isOwner}
          privateMessage="Liked posts are private."
          isLoading={isLoadingLikes}
          error={likesError}
          posts={likedPosts}
          emptyState={
            <div className="py-10">
              <EmptyState
                className="bg-transparent border-none"
                icon={Heart}
                title="No liked posts"
                description="Posts you like will appear here for quick access."
              />
            </div>
          }
        />
      </TabsContent>

      {/* Saved Tab */}
      <TabsContent value="saved" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
        <PostCollectionTab
          isPrivate={!isOwner}
          privateMessage="Saved posts are private."
          isLoading={isSavedLoading}
          error={savedError}
          posts={savedPosts}
          emptyState={
            <div className="py-10">
              <EmptyState
                className="bg-transparent border-none"
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
