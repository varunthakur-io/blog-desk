import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUserId } from '@/features/auth';
import { 
  useProfileContent, 
  useProfileFollow, 
  useFollow 
} from '@/features/profile';
import { formatDate, formatJoinedDate } from '@/utils/formatters';
import { useProfile as useProfileBasic } from './useProfileBasic';

/**
 * MASTER HOOK: Coordinates all profile data for the Profile Page.
 * Merges identity, content (posts/likes), and follow logic.
 */
export const useProfile = () => {
  const { username } = useParams();
  const authUserId = useSelector(selectAuthUserId);
  const [activeTab, setActiveTab] = useState('posts');

  // 1. Basic Identity (Resolves username -> profileId)
  const { 
    profile, 
    profileId, 
    isOwner, 
    isLoading: profileLoading, 
    error: profileError 
  } = useProfileBasic({ username });

  // 2. Content (Posts, Liked Posts)
  const {
    userPosts,
    likedPosts,
    isLoading: postsLoading,
    isLoadingLikes,
    error: postsError,
    likesError,
  } = useProfileContent(profileId, activeTab);

  // 3. Follow Lists & Relationship
  const {
    isFollowing,
    isLoading: isFollowLoading,
    toggleFollow,
  } = useFollow(profileId);

  const {
    followersProfiles,
    followingProfiles,
    isFollowersLoading,
    isFollowingLoading,
  } = useProfileFollow(profileId, authUserId, activeTab, isOwner);

  // Formatted View Data
  const viewData = useMemo(() => ({
    displayName: profile?.name || 'Anonymous',
    displayEmail: profile?.email || '',
    displayBio: profile?.bio || '',
    avatarUrl: profile?.avatarUrl,
    joinedDate: formatJoinedDate(profile?.$createdAt),
    stats: {
      posts: profile?.postsCount || 0,
      followers: profile?.followersCount || 0,
      following: profile?.followingCount || 0,
    }
  }), [profile]);

  return {
    // states
    authUserId,
    profileId,
    profile,
    isOwner,
    activeTab,
    setActiveTab,

    // view data
    ...viewData,

    // loading & errors
    profileLoading,
    postsLoading,
    isLoadingLikes,
    isFollowLoading,
    isFollowersLoading,
    isFollowingLoading,
    profileError,
    postsError,
    likesError,
    isFetchingUsername: profileLoading && !profileId, // Alias for legacy Profile.jsx
    usernameFetchError: profileError, // Alias for legacy Profile.jsx

    // content
    userPosts,
    likedPosts,

    // follow
    isFollowing,
    handleToggleFollow: toggleFollow,
    followersProfiles,
    followingProfiles,
  };
};
