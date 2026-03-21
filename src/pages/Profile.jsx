// UI Components
import { ProfileSkeleton, ProfileInfo, EditProfileDialog, ProfileTabs } from '@/components/profile';
import { Separator } from '@/components/ui/separator';

// Hooks
import { useProfile } from '@/hooks/profile';

export default function Profile() {
  const {
    // loading states
    authLoading,
    profileLoading,
    postsLoading,
    isFetchingUsername,
    isLoadingLikes,

    // errors
    profileError,
    postsError,
    likesError,
    usernameFetchError,

    // profile details
    profileId,
    profile,
    displayName,
    displayEmail,
    displayBio,
    avatarUrl,
    joinedDate,
    isOwner,

    // post collections
    userPosts,
    likedPosts,

    // UI state
    activeTab,
    setActiveTab,
  } = useProfile();

  if (isFetchingUsername) return <ProfileSkeleton />;
  if (usernameFetchError)
    return <div className="p-8 text-center text-red-500">{usernameFetchError}</div>;
  if (!profileId) return <div className="p-8 text-center">Profile not found.</div>;
  if (authLoading || profileLoading) return <ProfileSkeleton />;
  if (!profile && profileError)
    return <div className="p-8 text-center text-red-500">{profileError}</div>;

  return (
    <div className="py-2">
      <div className="flex flex-col md:flex-row gap-8 items-start relative">
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
        />

        <div className="absolute right-0 top-0">
          <EditProfileDialog profile={profile} profileId={profileId} isOwner={isOwner} />
        </div>
      </div>

      <Separator className="my-8" />

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
