import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Edit, Mail, CalendarDays } from 'lucide-react';
import PostCard from '@/components/posts/PostCard';
import PostCardSkeleton from '@/components/posts/PostCardSkeleton';

const ProfileTabs = ({
  activeTab,
  setActiveTab,
  isOwner,
  postsLoading,
  initialPostsLoaded,
  userPosts,
  likedPosts,
  isLoadingLikes,
  likesError,
  displayBio,
  displayEmail,
  joinedDate,
}) => {
  return (
    <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto sm:mx-0 mb-8">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="likes">Liked</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-6">
        {postsLoading && !initialPostsLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {userPosts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <Edit className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No posts yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              {isOwner
                ? 'Share your thoughts with the world. Create your first post now.'
                : "This user hasn't posted anything yet."}
            </p>
            {isOwner && (
              <Button asChild>
                <a href="/create">Create Post</a>
              </Button>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="likes">
        {!isOwner ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>Liked posts are private.</p>
          </div>
        ) : isLoadingLikes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : likesError ? (
          <Alert variant="destructive">
            <AlertDescription>{likesError}</AlertDescription>
          </Alert>
        ) : likedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {likedPosts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
            <p className="text-muted-foreground">No liked posts yet.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="about">
        <div className="border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Bio</h3>
            <p className="text-muted-foreground">
              {displayBio || 'No bio available.'}
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Contact
              </h4>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{displayEmail}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Joined
              </h4>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
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
