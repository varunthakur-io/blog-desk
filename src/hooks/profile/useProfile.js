import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { profileService } from '@/services/profile';
import { postService } from '@/services/posts';
import { likeService } from '@/services/likes';
import { followService } from '@/services/follows';
import { formatJoinedDate } from '@/utils/formatters';
import { parseApiError } from '@/lib/error-handler';
import toast from 'react-hot-toast';

import { selectAuthUserId, selectAuthEmail, selectIsAuthLoading } from '@/store/auth';

import {
  selectProfileById,
  selectIsProfileLoading,
  selectProfileError,
  setProfileLoading,
  setUserProfile,
  setProfileError,
  setFollowers,
} from '@/store/profile';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { username } = useParams();

  // Auth state
  const authUserId = useSelector(selectAuthUserId);
  const authLoading = useSelector(selectIsAuthLoading);
  const authUserEmail = useSelector(selectAuthEmail);

  // Temporary profile until Redux resolves it
  const [localProfile, setLocalProfile] = useState(null);

  // Loading states
  const [usernameFetchStatus, setUsernameFetchStatus] = useState(username ? 'loading' : 'idle');
  const [postsFetchStatus, setPostsFetchStatus] = useState('idle');
  const [likesFetchStatus, setLikesFetchStatus] = useState('idle');

  // Error states
  const [usernameFetchError, setUsernameFetchError] = useState(null);
  const [postsError, setPostsError] = useState('');
  const [likesError, setLikesError] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('posts');

  // Data state
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followFetchStatus, setFollowFetchStatus] = useState('idle');
  const [followActionStatus, setFollowActionStatus] = useState('idle');

  // Fetch profile using the username from the URL
  useEffect(() => {
    if (!username) {
      setUsernameFetchStatus('idle');
      return;
    }

    let cancelled = false;

    const fetchByUsername = async () => {
      setUsernameFetchStatus('loading');
      setUsernameFetchError(null);

      try {
        const fetchedProfile = await profileService.getProfileByUsername(username);

        if (cancelled) return;

        if (fetchedProfile) {
          setLocalProfile(fetchedProfile);
          dispatch(setUserProfile(fetchedProfile));
          setUsernameFetchStatus('success');
        } else {
          setUsernameFetchError('Profile not found.');
          setUsernameFetchStatus('error');
        }
      } catch {
        if (!cancelled) {
          setUsernameFetchError('Failed to load profile.');
          setUsernameFetchStatus('error');
        }
      }
    };

    fetchByUsername();

    return () => {
      cancelled = true;
    };
  }, [username, dispatch]);

  // Determine which profile is being viewed
  const profileId = username ? localProfile?.$id : authUserId;

  // Check if the logged-in user owns this profile
  const isOwner = !!authUserId && authUserId === profileId;

  // Redux profile state
  const reduxProfile = useSelector((state) => selectProfileById(state, profileId));

  const profileLoading = useSelector((state) => selectIsProfileLoading(state, profileId));

  const profileError = useSelector((state) => selectProfileError(state, profileId));

  // Prefer Redux profile if available
  const profile = reduxProfile || localProfile;

  // Ensure the profile exists in Redux cache
  useEffect(() => {
    if (!profileId || (isOwner && authLoading) || (profile && !profileError)) return;

    let cancelled = false;

    const loadProfile = async () => {
      dispatch(setProfileLoading(profileId));

      try {
        const profileObj = await profileService.getProfile(profileId);

        if (!cancelled) {
          dispatch(setUserProfile(profileObj));
        }
      } catch (error) {
        if (!cancelled) {
          dispatch(
            setProfileError({
              userId: profileId,
              error: error?.message || 'Failed to load profile.',
            }),
          );
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [profileId, profile, profileError, isOwner, authLoading, dispatch]);

  // Fetch posts created by this user
  useEffect(() => {
    if (!profileId || (isOwner && authLoading)) return;

    let cancelled = false;

    const loadUserPosts = async () => {
      setPostsFetchStatus('loading');
      setPostsError('');

      try {
        const postPage = await postService.getPostsByUserId(
          profileId,
          1,
          100,
          '',
          isOwner ? 'all' : 'published',
          'newest',
        );

        if (cancelled) return;

        setUserPosts(Array.isArray(postPage?.documents) ? postPage.documents : []);
        setPostsFetchStatus('success');
      } catch (error) {
        if (!cancelled) {
          setPostsError(error?.message || 'Failed to fetch posts.');
          setPostsFetchStatus('error');
        }
      }
    };

    loadUserPosts();

    return () => {
      cancelled = true;
    };
  }, [profileId, isOwner, authLoading]);

  // Fetch liked posts when the owner opens the Likes tab
  useEffect(() => {
    if (!isOwner || activeTab !== 'likes' || !profileId) return;

    let cancelled = false;

    const fetchLikedPosts = async () => {
      setLikesFetchStatus('loading');
      setLikesError('');

      try {
        const likedPostsPage = await likeService.getLikedPostsByUserId(profileId);

        if (!cancelled) {
          setLikedPosts(likedPostsPage.documents || []);
          setLikesFetchStatus('success');
        }
      } catch (error) {
        if (!cancelled) {
          setLikesError(error?.message || 'Failed to load liked posts.');
          setLikesFetchStatus('error');
        }
      }
    };

    fetchLikedPosts();

    return () => {
      cancelled = true;
    };
  }, [activeTab, isOwner, profileId]);

  // Check if the current user is following this profile
  useEffect(() => {
    if (isOwner || !authUserId || !profileId) return;

    let cancelled = false;

    const checkFollowStatus = async () => {
      setFollowFetchStatus('loading');
      try {
        const following = await followService.isFollowing(authUserId, profileId);
        if (!cancelled) {
          setIsFollowing(following);
          setFollowFetchStatus('success');
        }
      } catch (error) {
        if (!cancelled) setFollowFetchStatus(error);
      }
    };

    checkFollowStatus();

    return () => {
      cancelled = true;
    };
  }, [authUserId, profileId, isOwner]);

  const handleToggleFollow = async () => {
    if (!authUserId) return;
    if (followActionStatus === 'loading') return;

    setFollowActionStatus('loading');
    const originalState = isFollowing;

    try {
      if (originalState) {
        await followService.unfollowUser(authUserId, profileId);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await followService.followUser(authUserId, profileId);
        setIsFollowing(true);
        toast.success('Following');
      }
      setFollowActionStatus('success');
    } catch (error) {
      setFollowActionStatus('error');
      const message = parseApiError(error, `Failed to ${originalState ? 'unfollow' : 'follow'}`);
      toast.error(message);
    } finally {
      setFollowActionStatus('idle');
    }
  };

  // Data prepared for UI display
  const displayName = profile?.name || 'Unnamed User';
  const displayEmail = isOwner ? authUserEmail : '';
  const displayBio = profile?.bio || '';
  const avatarUrl = profile?.avatarUrl || null;

  const joinedDate = formatJoinedDate(profile?.$createdAt);

  const [followersProfiles, setFollowersProfiles] = useState([]);
  const [followingProfiles, setFollowingProfiles] = useState([]);
  const [isFollowersLoading, setIsFollowersLoading] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  // 1. Fetch Followers List (Lazy loaded when tab opens)
  useEffect(() => {
    if (!profileId || activeTab !== 'followers') return;

    let cancelled = false;
    const fetchFollowers = async () => {
      setIsFollowersLoading(true);
      try {
        const followers = await followService.getFollowers(profileId);
        const followerIds = followers.map((f) => f.followerId);

        if (followerIds.length > 0) {
          const profiles = await profileService.getProfilesByIds(followerIds);
          if (!cancelled) setFollowersProfiles(profiles);
        } else {
          if (!cancelled) setFollowersProfiles([]);
        }
      } catch (error) {
        console.error('Failed to fetch followers:', error);
      } finally {
        if (!cancelled) setIsFollowersLoading(false);
      }
    };

    fetchFollowers();
    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab]);

  // 2. Fetch Following List (Lazy loaded when tab opens)
  useEffect(() => {
    if (!profileId || activeTab !== 'following') return;

    let cancelled = false;
    const fetchFollowing = async () => {
      setIsFollowingLoading(true);
      try {
        const following = await followService.getFollowing(profileId);
        const followingIds = following.map((f) => f.followingId);

        if (followingIds.length > 0) {
          const profiles = await profileService.getProfilesByIds(followingIds);
          if (!cancelled) setFollowingProfiles(profiles);
        } else {
          if (!cancelled) setFollowingProfiles([]);
        }
      } catch (error) {
        console.error('Failed to fetch following:', error);
      } finally {
        if (!cancelled) setIsFollowingLoading(false);
      }
    };

    fetchFollowing();
    return () => {
      cancelled = true;
    };
  }, [profileId, activeTab]);

  return {
    profileId,
    isOwner,
    profile,
    profileLoading,
    profileError,

    authUserId,
    authLoading,

    isFetchingUsername: usernameFetchStatus === 'loading',
    usernameFetchError,

    userPosts,
    postsLoading: postsFetchStatus === 'loading',
    postsError,

    activeTab,
    setActiveTab,

    likedPosts,
    isLoadingLikes: likesFetchStatus === 'loading',
    likesError,

    isFollowing,
    isFollowLoading: followFetchStatus === 'loading' || followActionStatus === 'loading',
    handleToggleFollow,

    displayName,
    displayEmail,
    displayBio,
    avatarUrl,
    joinedDate,

    // Follower/Following lists
    followersProfiles,
    followingProfiles,
    isFollowersLoading,
    isFollowingLoading,
  };
};
