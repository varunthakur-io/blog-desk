import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { postService } from '@/services/posts';
import { likeService } from '@/services/likes';
import { commentService } from '@/services/comments';
import { profileService } from '@/services/profile';
import { selectPostById, setPostDetail } from '@/store/posts';
import { selectAuthUserId } from '@/store/auth';
import { selectProfileById, setUserProfile } from '@/store/profile';

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

  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikedLoading, setIsLikedLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  const [comments, setComments] = useState([]);

  // Read time calc
  const estimatedReadTime = post?.content
    ? Math.max(1, Math.ceil(post.content.split(' ').length / 200))
    : 1;

  // 1. Fetch Post & Author
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

  // 2. Like Status Sync
  useEffect(() => {
    if (!post) return;
    setLikesCount(post.likesCount || 0);

    let cancelled = false;
    const checkLike = async () => {
      if (!authUserId) {
        setIsLiked(false);
        setIsLikedLoading(false);
        return;
      }
      setIsLikedLoading(true);
      try {
        const liked = await likeService.hasUserLiked(post.$id, authUserId);
        if (!cancelled) setIsLiked(!!liked);
      } catch {
        if (!cancelled) setIsLiked(false);
      } finally {
        if (!cancelled) setIsLikedLoading(false);
      }
    };
    checkLike();
    return () => {
      cancelled = true;
    };
  }, [post, authUserId]);

  // 3. Comments & Commenters
  useEffect(() => {
    if (!post?.$id) return;
    commentService.getCommentsByPost(post.$id).then(setComments).catch(console.error);
  }, [post?.$id]);

  useEffect(() => {
    if (comments.length === 0) return;
    comments.forEach((c) => {
      if (c.userId && !profileCache[c.userId]) {
        profileService
          .getProfile(c.userId)
          .then((p) => dispatch(setUserProfile(p)))
          .catch(console.warn);
      }
    });
  }, [comments, profileCache, dispatch]);

  // Handlers
  const handleLike = useCallback(async () => {
    if (!authUserId) return toast.error('Login to like!');
    if (isLiking || isLikedLoading || !post?.$id) return;

    setIsLiking(true);
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((p) => Math.max(0, p + (wasLiked ? -1 : 1)));

    try {
      if (wasLiked) {
        await likeService.unlikePost(post.$id, authUserId);
      } else {
        await likeService.likePost(post.$id, authUserId);
      }
    } catch {
      // Revert optimistic update
      setIsLiked(wasLiked);
      setLikesCount((p) => Math.max(0, p + (wasLiked ? 1 : -1)));
      toast.error('Like failed.');
    } finally {
      setIsLiking(false);
    }
  }, [authUserId, isLiking, isLikedLoading, post?.$id, isLiked]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch {
      toast.error('Share failed.');
    }
  }, []);

  return {
    // routing / identity
    id,
    authUserId,

    // cached entities
    post,
    profileCache,
    authorProfile,
    currentUserProfile,

    // loading and errors
    isPostLoading: postFetchStatus === 'loading',
    postFetchError,

    // interaction state
    likesCount,
    isLiked,
    isLikedLoading,
    isLiking,

    // post content
    comments,
    estimatedReadTime,

    // actions
    handleLike,
    handleShare,
    navigate,
  };
};
