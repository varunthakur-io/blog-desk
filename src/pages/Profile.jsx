import { ProfileSkeleton, ProfileInfo, EditProfileDialog, ProfileTabs } from '@/components/profile';
import { Separator } from '@/components/ui/separator';
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
  } = useProfile();

  if (isFetchingUsername) return <ProfileSkeleton />;
  if (usernameFetchError)
    return <div className="py-20 text-center text-sm text-destructive">{usernameFetchError}</div>;
  if (!profileId)
    return <div className="py-20 text-center text-sm text-muted-foreground">Profile not found.</div>;
  if (authLoading || profileLoading) return <ProfileSkeleton />;
  if (!profile && profileError)
    return <div className="py-20 text-center text-sm text-destructive">{profileError}</div>;

  return (
    <div className="py-2 animate-in fade-in duration-500">
      {/* Header row — info + edit button */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <ProfileInfo
          displayName={displayName}
          displayEmail={displayEmail}
          displayBio={displayBio}
          avatarUrl={avatarUrl}
          joinedDate={joinedDate}
          isOwner={isOwner}
          postsCount={postsLoading ? (profile?.postsCount || 0) : userPosts.length}
          followersCount={profile?.followersCount || 0}
          followingCount={profile?.followingCount || 0}
        />
        {/* Edit button — sits naturally after info instead of absolutely positioned */}
        <div className="shrink-0">
          <EditProfileDialog profile={profile} profileId={profileId} isOwner={isOwner} />
        </div>
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
      />
    </div>
  );
}
