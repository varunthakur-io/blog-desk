import { useState } from 'react';
import { EditProfileDialog, ProfileTabs, ProfileInfo, ProfileSkeleton, NetworkDialog } from '@/features/profile';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, Settings, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/features/profile';

export default function Profile() {
  const navigate = useNavigate();
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [networkType, setNetworkType] = useState('followers'); // 'followers' | 'following'

  const {
    profile,
    isOwner,
    userPosts,
    likedPosts,
    savedPosts,
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
    fetchFollowers,
    fetchFollowing,

    isSavedLoading,
    savedError,
    isFetchingUsername,
    usernameFetchError,
    postsLoading,
    postsError,
    isLoadingLikes,
    likesError,
  } = useProfile();

  if (isFetchingUsername) return <ProfileSkeleton />;
  if (usernameFetchError)
    return <div className="py-20 text-center text-sm text-destructive">{usernameFetchError}</div>;

  const handleOpenNetwork = (type) => {
    setNetworkType(type);
    setIsNetworkOpen(true);
    // Trigger lazy load
    if (type === 'followers') fetchFollowers();
    else fetchFollowing();
  };

  const actionButton = isOwner ? (
    <div className="flex gap-2">
      <EditProfileDialog
        profile={profile}
        trigger={
          <Button variant="outline" size="sm" className="rounded-full gap-2 font-bold px-5">
            <Edit className="h-3.5 w-3.5" /> Edit Profile
          </Button>
        }
      />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/settings')}
        className="rounded-full h-9 w-9 border border-border"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      onClick={handleToggleFollow}
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      className="rounded-full gap-2 font-bold px-8 shadow-md transition-all active:scale-95"
      disabled={isFollowLoading || !authUserId}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-3.5 w-3.5" /> Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-3.5 w-3.5" /> Follow
        </>
      )}
    </Button>
  );

  return (
    <div className="page-wrapper py-10">
      <ProfileInfo
        profile={profile}
        isOwner={isOwner}
        actionButton={actionButton}
        onFollowersClick={() => handleOpenNetwork('followers')}
        onFollowingClick={() => handleOpenNetwork('following')}
      />

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
        savedPosts={savedPosts}
        isSavedLoading={isSavedLoading}
        savedError={savedError}
      />

      <NetworkDialog 
        isOpen={isNetworkOpen}
        onOpenChange={setIsNetworkOpen}
        title={networkType === 'followers' ? 'Followers' : 'Following'}
        users={networkType === 'followers' ? followersProfiles : followingProfiles}
        isLoading={networkType === 'followers' ? isFollowersLoading : isFollowingLoading}
      />
    </div>
  );
}
