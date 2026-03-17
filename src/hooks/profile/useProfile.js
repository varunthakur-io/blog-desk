import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { profileService } from '@/services/profile';
import { postService } from '@/services/posts';
import { likeService } from '@/services/likes';
import { selectAuthUserId, selectIsAuthLoading } from '@/store/auth';
import {
  selectProfileById,
  selectIsProfileLoading,
  selectProfileError,
  setProfileLoading,
  setUserProfile,
  setProfileError,
} from '@/store/profile';
import { selectPostsByAuthor, selectIsPostsLoading, selectInitialLoaded } from '@/store/posts';
import { setPostsStatus, setPostsError, setPostList, setPostPagination } from '@/store/posts';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { username } = useParams();

  const authUserId = useSelector(selectAuthUserId);
  const authLoading = useSelector(selectIsAuthLoading);
  const authUserEmail = useSelector((state) => state.auth.user?.email);

  const [localProfile, setLocalProfile] = useState(null);

  const [usernameFetchStatus, setUsernameFetchStatus] = useState(username ? 'loading' : 'idle');
  const [likesFetchStatus, setLikesFetchStatus] = useState('idle');

  const [usernameFetchError, setUsernameFetchError] = useState(null);
  const [likesError, setLikesError] = useState('');

  const [activeTab, setActiveTab] = useState('posts');
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    if (!username) {
      setUsernameFetchStatus('idle');
      return;
    }
    let cancelled = false;
    const fetchByUsername = async () => {
      setUsernameFetchStatus('loading');
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

  const profileId = username ? localProfile?.$id : authUserId;
  const isOwner = !!authUserId && authUserId === profileId;

  const reduxProfile = useSelector((state) => selectProfileById(state, profileId));
  const profileLoading = useSelector((state) => selectIsProfileLoading(state, profileId));
  const profileError = useSelector((state) => selectProfileError(state, profileId));
  const profile = reduxProfile || localProfile;

  const initialPostsLoaded = useSelector(selectInitialLoaded);
  const postsLoading = useSelector(selectIsPostsLoading);
  const userPosts = useSelector((state) => selectPostsByAuthor(state, profileId));

  const displayName = profile?.name || 'Unnamed User';
  const displayEmail = isOwner ? authUserEmail : '';
  const displayBio = profile?.bio || '';
  const avatarUrl = profile?.avatarUrl || null;
  const joinedDate = profile?.$createdAt
    ? new Date(profile.$createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  useEffect(() => {
    if (!profileId || (isOwner && authLoading) || (profile && !profileError)) return;
    let cancelled = false;
    const loadProfile = async () => {
      dispatch(setProfileLoading(profileId));
      try {
        const profileObj = await profileService.getProfile(profileId);
        if (!cancelled) dispatch(setUserProfile(profileObj));
      } catch (err) {
        if (!cancelled)
          dispatch(
            setProfileError({
              userId: profileId,
              error: err?.message || 'Failed to load profile.',
            }),
          );
      }
    };
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [dispatch, profileId, profile, profileError, isOwner, authLoading]);

  useEffect(() => {
    if (initialPostsLoaded) return;
    let cancelled = false;
    const fetchPostsOnce = async () => {
      dispatch(setPostsStatus('loading'));
      try {
        const data = await postService.getAllPosts();
        if (cancelled) return;
        const posts = Array.isArray(data) ? data : (data?.documents ?? []);
        dispatch(setPostList(posts));
        dispatch(setPostPagination({ initialLoaded: true }));
      } catch (err) {
        if (!cancelled) dispatch(setPostsError(err?.message || 'Failed to fetch posts.'));
      }
    };
    fetchPostsOnce();
    return () => {
      cancelled = true;
    };
  }, [dispatch, initialPostsLoaded]);

  useEffect(() => {
    if (!isOwner || activeTab !== 'likes' || !profileId) return;
    let cancelled = false;
    const fetchLikedPosts = async () => {
      setLikesFetchStatus('loading');
      try {
        const res = await likeService.getLikedPostsByUserId(profileId);
        if (!cancelled) {
          setLikedPosts(res.documents || []);
          setLikesFetchStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          setLikesError(err?.message || 'Failed to load liked posts.');
          setLikesFetchStatus('error');
        }
      }
    };
    fetchLikedPosts();
    return () => {
      cancelled = true;
    };
  }, [activeTab, isOwner, profileId]);

  return {
    profileId,
    isOwner,
    profile,
    profileLoading,
    profileError,
    isFetchingUsername: usernameFetchStatus === 'loading',
    usernameFetchError,
    authLoading,
    userPosts,
    postsLoading,
    initialPostsLoaded,
    activeTab,
    setActiveTab,
    likedPosts,
    isLoadingLikes: likesFetchStatus === 'loading',
    likesError,
    displayName,
    displayEmail,
    displayBio,
    avatarUrl,
    joinedDate,
  };
};
