import { useState } from 'react';
import { useSelector } from 'react-redux';
import { formatJoinedDate } from '@/utils/formatters';
import { selectAuthEmail, selectIsAuthLoading } from '@/store/auth';

import { useProfileIdentity } from './useProfileIdentity';
import { useProfileContent } from './useProfileContent';
import { useProfileFollow } from './useProfileFollow';

/**
 * Main Profile Orchestration Hook.
 * Combines identity, content, and social logic.
 */
export const useProfile = () => {
  const [activeTab, setActiveTab] = useState('posts');

  // 1. Core Identity Logic
  const { profileId, profile, isOwner, usernameFetchStatus, usernameFetchError, authUserId } =
    useProfileIdentity();

  // 2. Social / Follow Logic
  const {
    isFollowing,
    isFollowLoading,
    isFollowersLoading,
    isFollowingLoading,
    followersProfiles,
    followingProfiles,
    handleToggleFollow,
  } = useProfileFollow(profileId, authUserId, activeTab, isOwner);

  // 3. Content Logic (Posts & Likes)
  const { userPosts, likedPosts, postsLoading, isLoadingLikes, postsError, likesError } =
    useProfileContent(profileId, activeTab, isOwner);

  // 4. Identity derived data
  const authUserEmail = useSelector(selectAuthEmail);
  const authLoading = useSelector(selectIsAuthLoading);

  const displayName = profile?.name || 'Unnamed User';
  const displayEmail = isOwner ? authUserEmail : '';
  const displayBio = profile?.bio || '';
  const avatarUrl = profile?.avatarUrl || null;
  const joinedDate = formatJoinedDate(profile?.$createdAt);

  return {
    // Identity
    profileId,
    isOwner,
    profile,
    profileLoading: usernameFetchStatus === 'loading',
    profileError: usernameFetchError,
    authUserId,
    authLoading,
    isFetchingUsername: usernameFetchStatus === 'loading',
    usernameFetchError,

    // Social
    isFollowing,
    isFollowLoading,
    isFollowersLoading,
    isFollowingLoading,
    followersProfiles,
    followingProfiles,
    handleToggleFollow,

    // Content
    userPosts,
    likedPosts,
    postsLoading,
    isLoadingLikes,
    postsError,
    likesError,
    activeTab,
    setActiveTab,

    // Display
    displayName,
    displayEmail,
    displayBio,
    avatarUrl,
    joinedDate,
  };
};
