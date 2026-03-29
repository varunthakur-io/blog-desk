import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { postService } from '@/services/posts';
import { commentService } from '@/services/comments';
import { profileService } from '@/services/profile';
import { calculateReadTime } from '@/utils/formatters';
import { selectPostById, setPostDetail } from '@/store/posts';
import { selectAuthUserId } from '@/store/auth';
import { selectProfileById, setUserProfile } from '@/store/profile';
import { useLike } from './useLike';

export const usePostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const post = useSelector((state) => selectPostById(state, id));
  const authUserId = useSelector(selectAuthUserId);
  const profileCache = useSelector((state) => state.profile.byId);
  const authorProfile = useSelector((state) => selectProfileById(state, post?.authorId));
  const currentUserProfile = useSelector((state) => selectProfileById(state, authUserId));

  // Local UI States
  const [postFetchStatus, setPostFetchStatus] = useState(post ? 'success' : 'loading');
  const [postFetchError, setPostFetchError] = useState('');
  const [comments, setComments] = useState([]);

  // Like logic via shared hook
  const {
    likesCount,
    isLiked,
    isLikedLoading,
    isLiking,
    toggleLike,
  } = useLike(post);

  // Read time calc
  const estimatedReadTime = calculateReadTime(post?.content);

  // 1. Fetch Post & Author if not in cache
  useEffect(() => {
    if (!id) {
      setPostFetchError('No post ID provided.');
      setPostFetchStatus('error');
      return;
    }

    if (post) {
      setPostFetchStatus('success');
      if (post.authorId && !authorProfile) {
        profileService
          .getProfile(post.authorId)
          .then((p) => dispatch(setUserProfile(p)))
          .catch(console.warn);
      }
      return;
    }

    let cancelled = false;
    setPostFetchStatus('loading');

    const fetchPost = async () => {
      try {
        const fetched = await postService.getPostById(id);
        if (cancelled) return;
        if (fetched) {
          dispatch(setPostDetail(fetched));
          setPostFetchStatus('success');
          if (fetched.authorId) {
            profileService
              .getProfile(fetched.authorId)
              .then((p) => !cancelled && dispatch(setUserProfile(p)))
              .catch(console.warn);
          }
        } else {
          setPostFetchError('Post not found.');
          setPostFetchStatus('error');
        }
      } catch (error) {
        if (!cancelled) {
          setPostFetchError(error?.message || 'Failed to load post.');
          setPostFetchStatus('error');
        }
      }
    };
    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [id, post, authorProfile, dispatch]);

  // 2. Fetch Comments
  useEffect(() => {
    if (!post?.$id) return;
    commentService.getCommentsByPost(post.$id).then(setComments).catch(console.error);
  }, [post?.$id]);

  // 3. Sync commenter profiles
  useEffect(() => {
    if (comments.length === 0) return;

    const missingUserIds = [
      ...new Set(comments.map((c) => c.userId).filter((uid) => uid && !profileCache[uid])),
    ];

    if (missingUserIds.length === 0) return;

    let cancelled = false;
    const fetchCommenterProfiles = async () => {
      try {
        const fetchedProfiles = await profileService.getProfilesByIds(missingUserIds);
        if (!cancelled && fetchedProfiles.length > 0) {
          fetchedProfiles.forEach((p) => dispatch(setUserProfile(p)));
        }
      } catch (error) {
        console.warn('Batch profile fetch failed:', error);
      }
    };
    fetchCommenterProfiles();

    return () => {
      cancelled = true;
    };
  }, [comments, profileCache, dispatch]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch {
      toast.error('Share failed.');
    }
  }, []);

  return {
    id,
    authUserId,
    post,
    profileCache,
    authorProfile,
    currentUserProfile,
    isPostLoading: postFetchStatus === 'loading',
    postFetchError,
    likesCount,
    isLiked,
    isLikedLoading,
    isLiking,
    comments,
    estimatedReadTime,
    handleLike: toggleLike,
    handleShare,
    navigate,
  };
};
