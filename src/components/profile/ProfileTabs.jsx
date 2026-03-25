import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Edit, Mail, CalendarDays, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostCard from '@/components/posts/PostCard';
import { PostCardSkeleton } from '@/components/posts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common';

const UserCard = ({ user }) => (
  <Link key={user.$id} to={`/profile/${user.username}`} className="block group">
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border bg-card hover:bg-muted/40 transition-all duration-200 group-hover:border-primary/20 group-hover:shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border group-hover:border-primary/30 transition-colors">
          <AvatarImage src={user.avatarUrl} className="object-cover" />
          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="text-sm font-semibold group-hover:text-primary transition-colors">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </div>
      </div>
    </div>
  </Link>
);

const UserListSkeleton = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-card">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
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
  followersProfiles = [],
  followingProfiles = [],
  isFollowersLoading,
  isFollowingLoading,
}) => {
  return (
    <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
      <div className="overflow-x-auto pb-2">
        <TabsList className="h-9 bg-muted/50 p-1 mb-6 w-fit rounded-lg border">
          <TabsTrigger value="posts" className="rounded-md text-xs px-4 font-medium">
            Posts
          </TabsTrigger>
          <TabsTrigger value="likes" className="rounded-md text-xs px-4 font-medium">
            Liked
          </TabsTrigger>
          <TabsTrigger value="followers" className="rounded-md text-xs px-4 font-medium">
            Followers
          </TabsTrigger>
          <TabsTrigger value="following" className="rounded-md text-xs px-4 font-medium">
            Following
          </TabsTrigger>
          <TabsTrigger value="about" className="rounded-md text-xs px-4 font-medium">
            About
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Posts Tab */}
      <TabsContent value="posts" className="mt-0 outline-none">
        {postsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : postsError ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{postsError}</AlertDescription>
          </Alert>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userPosts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
          </div>
        ) : (
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
                <Button asChild size="sm" className="rounded-full px-5 text-xs">
                  <Link to="/create">Write a Post</Link>
                </Button>
              )
            }
          />
        )}
      </TabsContent>

      {/* Likes Tab */}
      <TabsContent value="likes" className="mt-0 outline-none">
        {!isOwner ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Liked posts are private.
          </div>
        ) : isLoadingLikes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : likesError ? (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{likesError}</AlertDescription>
          </Alert>
        ) : likedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {likedPosts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No liked posts"
            description="Posts you like will appear here."
          />
        )}
      </TabsContent>

      {/* Followers Tab */}
      <TabsContent value="followers" className="mt-0 space-y-4 outline-none">
        {isFollowersLoading ? (
          <UserListSkeleton />
        ) : followersProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {followersProfiles.map((user) => (
              <UserCard key={user.$id} user={user} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No followers yet"
            description={
              isOwner
                ? "You don't have any followers yet."
                : "This user doesn't have any followers yet."
            }
          />
        )}
      </TabsContent>

      {/* Following Tab */}
      <TabsContent value="following" className="mt-0 space-y-4 outline-none">
        {isFollowingLoading ? (
          <UserListSkeleton />
        ) : followingProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {followingProfiles.map((user) => (
              <UserCard key={user.$id} user={user} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Not following anyone"
            description={
              isOwner ? "You aren't following anyone yet." : "This user isn't following anyone yet."
            }
          />
        )}
      </TabsContent>

      {/* About Tab */}
      <TabsContent value="about" className="mt-0 outline-none">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-2xl shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Bio
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {displayBio || 'No bio provided.'}
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {isOwner && displayEmail && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Email
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{displayEmail}</span>
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Member since
              </p>
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
