import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Edit, Mail, CalendarDays, Heart } from 'lucide-react';
import PostCard from '@/components/posts/PostCard';
import PostCardSkeleton from '@/components/posts/PostCardSkeleton';

const EmptyPosts = ({ isOwner, isLikes }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
    <div className="bg-muted p-4 rounded-full mb-3">
      {isLikes ? (
        <Heart className="w-6 h-6 text-muted-foreground/50" />
      ) : (
        <Edit className="w-6 h-6 text-muted-foreground/50" />
      )}
    </div>
    <h3 className="text-sm font-semibold mb-1">
      {isLikes ? 'No liked posts' : 'No posts yet'}
    </h3>
    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-4">
      {isLikes
        ? 'Posts you like will appear here.'
        : isOwner
        ? 'Share your thoughts with the world.'
        : "This user hasn't posted anything yet."}
    </p>
    {isOwner && !isLikes && (
      <Button asChild size="sm" className="rounded-full px-5 text-xs">
        <a href="/create">Write a Post</a>
      </Button>
    )}
  </div>
);

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
  displayBio,
  displayEmail,
  joinedDate,
}) => {
  return (
    <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
      <TabsList className="h-9 bg-muted p-1 mb-6 w-fit rounded-lg">
        <TabsTrigger value="posts" className="rounded-md text-xs px-4 font-medium">Posts</TabsTrigger>
        <TabsTrigger value="likes" className="rounded-md text-xs px-4 font-medium">Liked</TabsTrigger>
        <TabsTrigger value="about" className="rounded-md text-xs px-4 font-medium">About</TabsTrigger>
      </TabsList>

      {/* Posts Tab */}
      <TabsContent value="posts" className="mt-0">
        {postsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : postsError ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{postsError}</AlertDescription>
          </Alert>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {userPosts.map((post) => <PostCard key={post.$id} post={post} />)}
          </div>
        ) : (
          <EmptyPosts isOwner={isOwner} isLikes={false} />
        )}
      </TabsContent>

      {/* Likes Tab */}
      <TabsContent value="likes" className="mt-0">
        {!isOwner ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Liked posts are private.
          </div>
        ) : isLoadingLikes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : likesError ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{likesError}</AlertDescription>
          </Alert>
        ) : likedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {likedPosts.map((post) => <PostCard key={post.$id} post={post} />)}
          </div>
        ) : (
          <EmptyPosts isOwner={isOwner} isLikes={true} />
        )}
      </TabsContent>

      {/* About Tab */}
      <TabsContent value="about" className="mt-0">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-2xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Bio</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {displayBio || 'No bio provided.'}
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {isOwner && displayEmail && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Email</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{displayEmail}</span>
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Member since</p>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{joinedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
