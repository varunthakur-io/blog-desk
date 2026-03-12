import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { profileService } from '@/services/profile';
import { postService } from '@/services/posts';
import { likeService } from '@/services/likes';
import { selectAuthUserId, selectAuthLoading } from '@/store/auth';
import { selectProfileById, selectProfileLoading, selectProfileError } from '@/store/profile';
import { upsertProfile, setProfileLoading, setProfileError } from '@/store/profile';
import { selectPostsByAuthor, selectPostsLoading, selectInitialLoaded } from '@/store/posts';
import { setPostsLoading, setPostsError, setPosts, setInitialLoaded } from '@/store/posts';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { username } = useParams();

  const authUserId = useSelector(selectAuthUserId);
  const authLoading = useSelector(selectAuthLoading);

  const [localProfile, setLocalProfile] = useState(null);
  
  // Status states
  const [usernameFetchStatus, setUsernameFetchStatus] = useState(username ? 'loading' : 'idle');
  const [likesFetchStatus, setLikesFetchStatus] = useState('idle');
  
  const [usernameFetchError, setUsernameFetchError] = useState(null);
  const [likesError, setLikesError] = useState('');

  // Tabs state
  const [activeTab, setActiveTab] = useState('posts');
  const [likedPosts, setLikedPosts] = useState([]);

  // 1. Fetch by username if needed
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
          dispatch(upsertProfile(fetchedProfile));
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
    return () => { cancelled = true; };
  }, [username, dispatch]);

  const profileId = username ? localProfile?.$id : authUserId;
  const isOwner = !!authUserId && authUserId === profileId;

  const reduxProfile = useSelector((state) => selectProfileById(state, profileId));
  const profileLoading = useSelector((state) => selectProfileLoading(state, profileId));
  const profileError = useSelector((state) => selectProfileError(state, profileId));
  const profile = reduxProfile || localProfile;

  const initialPostsLoaded = useSelector(selectInitialLoaded);
  const postsLoading = useSelector(selectPostsLoading);
  const userPosts = useSelector((state) => selectPostsByAuthor(state, profileId));

  // Derived Values
  const displayName = profile?.name || 'Unnamed User';
  const displayEmail = profile?.email || '';
  const displayBio = profile?.bio || '';
  const avatarUrl = profile?.avatarUrl || null;
  const joinedDate = profile?.$createdAt ? new Date(profile.$createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';

  // 2. Load profile data
  useEffect(() => {
    if (!profileId || (isOwner && authLoading) || (profile && !profileError)) return;
    let cancelled = false;
    const loadProfile = async () => {
      dispatch(setProfileLoading({ userId: profileId, loading: true }));
      try {
        const profileObj = await profileService.getProfile(profileId);
        if (!cancelled) dispatch(upsertProfile(profileObj));
      } catch (err) {
        if (!cancelled) dispatch(setProfileError({ userId: profileId, error: err?.message || 'Failed to load profile.' }));
      } finally {
        if (!cancelled) dispatch(setProfileLoading({ userId: profileId, loading: false }));
      }
    };
    loadProfile();
    return () => { cancelled = true; };
  }, [dispatch, profileId, profile, profileError, isOwner, authLoading]);

  // 3. Load posts effect
  useEffect(() => {
    if (initialPostsLoaded) return;
    let cancelled = false;
    const fetchPostsOnce = async () => {
      dispatch(setPostsLoading(true));
      try {
        const data = await postService.getAllPosts();
        if (cancelled) return;
        const posts = Array.isArray(data) ? data : (data?.documents ?? []);
        dispatch(setPosts(posts));
        dispatch(setInitialLoaded(true));
      } catch (err) {
        if (!cancelled) dispatch(setPostsError(err?.message || 'Failed to fetch posts.'));
      } finally {
        if (!cancelled) dispatch(setPostsLoading(false));
      }
    };
    fetchPostsOnce();
    return () => { cancelled = true; };
  }, [dispatch, initialPostsLoaded]);

  // 4. Load likes effect
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
    return () => { cancelled = true; };
  }, [activeTab, isOwner, profileId]);

  return {
    profileId, isOwner, profile, profileLoading, profileError, 
    isFetchingUsername: usernameFetchStatus === 'loading', 
    usernameFetchError, 
    authLoading,
    userPosts, postsLoading, initialPostsLoaded,
    activeTab, setActiveTab, likedPosts, 
    isLoadingLikes: likesFetchStatus === 'loading', 
    likesError,
    displayName, displayEmail, displayBio, avatarUrl, joinedDate
  };
};
