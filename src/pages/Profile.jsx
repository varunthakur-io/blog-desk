import { EditProfileDialog, ProfileTabs, ProfileSkeleton, ProfileInfo } from '@/components/profile';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '@/hooks/profile';

export default function Profile() {
  const {
    authLoading,
    profileLoading,
    postsLoading,
    isFetchingUsername,
    isLoadingLikes,
    profileError,
    postsError,
    likesError,
    usernameFetchError,
    profileId,
    profile,
    displayName,
    displayEmail,
    displayBio,
    avatarUrl,
    joinedDate,
    isOwner,
    userPosts,
    likedPosts,
    activeTab,
    setActiveTab,

    // follow state & actions
    isFollowing,
    isFollowLoading,
    handleToggleFollow,
    authUserId,

    followersProfiles,
    followingProfiles,
    isFollowersLoading,
    isFollowingLoading,
  } = useProfile();

  if (isFetchingUsername) return <ProfileSkeleton />;
  if (usernameFetchError)
    return <div className="py-20 text-center text-sm text-destructive">{usernameFetchError}</div>;
  if (!profileId)
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">Profile not found.</div>
    );
  if (authLoading || profileLoading) return <ProfileSkeleton />;
  if (!profile && profileError)
    return <div className="py-20 text-center text-sm text-destructive">{profileError}</div>;

  const onFollowClick = () => {
    if (!authUserId) {
      toast.error('Please login to follow users');
      return;
    }
    handleToggleFollow();
  };

  const actionButton = isOwner ? (
    <EditProfileDialog profile={profile} profileId={profileId} isOwner={isOwner} />
  ) : (
    <Button
      variant={isFollowing ? 'secondary' : 'default'}
      size="sm"
      onClick={onFollowClick}
      disabled={isFollowLoading}
      className={`rounded-full px-6 font-medium transition-all ${
        !isFollowing
          ? 'shadow-sm active:scale-95'
          : 'hover:bg-destructive hover:text-destructive-foreground hover:border-destructive'
      }`}
    >
      {isFollowLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : isFollowing ? (
        <UserMinus className="h-4 w-4 mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );

  return (
    <div className="page-root">
      {/* Header Area */}
      <div className="mb-8">
        <ProfileInfo
          displayName={displayName}
          displayEmail={displayEmail}
          displayBio={displayBio}
          avatarUrl={avatarUrl}
          joinedDate={joinedDate}
          isOwner={isOwner}
          postsCount={postsLoading ? profile?.postsCount || 0 : userPosts.length}
          followersCount={profile?.followersCount || 0}
          followingCount={profile?.followingCount || 0}
          actionButton={actionButton}
        />
      </div>

      <Separator className="mb-8" />

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOwner={isOwner}
        postsLoading={postsLoading}
        postsError={postsError}
        userPosts={userPosts}
        likedPosts={likedPosts}
        isLoadingLikes={isLoadingLikes}
        likesError={likesError}
        displayBio={displayBio}
        displayEmail={displayEmail}
        joinedDate={joinedDate}
        followersProfiles={followersProfiles}
        followingProfiles={followingProfiles}
        isFollowersLoading={isFollowersLoading}
        isFollowingLoading={isFollowingLoading}
      />
    </div>
  );
}
