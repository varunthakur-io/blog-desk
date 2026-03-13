import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { postService } from '@/services/posts';
import { likeService } from '@/services/likes';
import { commentService } from '@/services/comments';
import { profileService } from '@/services/profile';
import { selectPostById, setPost } from '@/store/posts';
import { selectAuthUserId } from '@/store/auth';
import { selectProfileById, setUserProfile } from '@/store/profile';

export const usePostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const currentPost = useSelector((state) => selectPostById(state, id));
  const authUserId = useSelector(selectAuthUserId);
  const profiles = useSelector((state) => state.profile.byId);
  const authorProfile = useSelector((state) => selectProfileById(state, currentPost?.authorId));
  const currentUserProfile = useSelector((state) => selectProfileById(state, authUserId));

  // Local UI States
  const [status, setStatus] = useState(currentPost ? 'success' : 'loading'); 
  const [error, setError] = useState('');
  
  const [likesCount, setLikesCount] = useState(currentPost?.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikedLoading, setIsLikedLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  
  const [comments, setComments] = useState([]);

  // Read time calc
  const readTime = currentPost?.content
    ? Math.max(1, Math.ceil(currentPost.content.split(' ').length / 200))
    : 1;

  // 1. Fetch Post & Author
  useEffect(() => {
    if (!id) {
      setError('No post ID provided.');
      setStatus('error');
      return;
    }

    if (currentPost) {
      setStatus('success');
      if (currentPost.authorId && !authorProfile) {
        profileService.getProfile(currentPost.authorId)
          .then((p) => dispatch(setUserProfile(p)))
          .catch(console.warn);
      }
      return;
    }

    let mounted = true;
    setStatus('loading');
    
    const fetchPost = async () => {
      try {
        const fetched = await postService.getPostById(id);
        if (!mounted) return;
        if (fetched) {
          dispatch(setPost(fetched));
          setStatus('success');
          if (fetched.authorId) {
            profileService.getProfile(fetched.authorId)
              .then((p) => mounted && dispatch(setUserProfile(p)))
              .catch(console.warn);
          }
        } else {
          setError('Post not found.');
          setStatus('error');
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load post.');
          setStatus('error');
        }
      }
    };
    fetchPost();
    return () => { mounted = false; };
  }, [id, currentPost, authorProfile, dispatch]);

  // 2. Like Status Sync
  useEffect(() => {
    if (!currentPost) return;
    setLikesCount(currentPost.likesCount || 0);

    let mounted = true;
    const checkLike = async () => {
      if (!authUserId) {
        setIsLiked(false);
        setIsLikedLoading(false);
        return;
      }
      setIsLikedLoading(true);
      try {
        const liked = await likeService.hasUserLiked(currentPost.$id, authUserId);
        if (mounted) setIsLiked(!!liked);
      } catch {
        if (mounted) setIsLiked(false);
      } finally {
        if (mounted) setIsLikedLoading(false);
      }
    };
    checkLike();
    return () => { mounted = false; };
  }, [currentPost, authUserId]);

  // 3. Comments & Commenters
  useEffect(() => {
    if (!currentPost?.$id) return;
    commentService.getCommentsByPost(currentPost.$id)
      .then(setComments)
      .catch(console.error);
  }, [currentPost?.$id]);

  useEffect(() => {
    if (comments.length === 0) return;
    comments.forEach(c => {
      if (c.userId && !profiles[c.userId]) {
        profileService.getProfile(c.userId)
          .then(p => dispatch(setUserProfile(p)))
          .catch(console.warn);
      }
    });
  }, [comments, profiles, dispatch]);

  // Handlers
  const handleLike = useCallback(async () => {
    if (!authUserId) return toast.error('Login to like!');
    if (isLiking || isLikedLoading || !currentPost?.$id) return;

    setIsLiking(true);
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(p => Math.max(0, p + (wasLiked ? -1 : 1)));

    try {
      if (wasLiked) {
        await likeService.unlikePost(currentPost.$id, authUserId);
      } else {
        await likeService.likePost(currentPost.$id, authUserId);
      }
    } catch {
      // Revert optimistic update
      setIsLiked(wasLiked);
      setLikesCount(p => Math.max(0, p + (wasLiked ? 1 : -1)));
      toast.error('Like failed.');
    } finally {
      setIsLiking(false);
    }
  }, [authUserId, isLiking, isLikedLoading, currentPost?.$id, isLiked]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch {
      toast.error('Share failed.');
    }
  }, []);

  return {
    id, currentPost, authUserId, profiles, authorProfile, currentUserProfile,
    isLoading: status === 'loading', error, likesCount, isLiked, isLikedLoading, isLiking, comments, readTime,
    handleLike, handleShare, navigate
  };
};
