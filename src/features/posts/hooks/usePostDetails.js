import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { postService } from '@/features/posts';
import { commentService } from '@/features/comments';
import { profileService } from '@/features/profile';
import { calculateReadTime } from '@/utils/formatters';
import { selectPostById, setPostDetail } from '@/features/posts';
import { selectAuthUserId } from '@/features/auth';
import { selectProfileById, setUserProfile } from '@/features/profile';
import { getUniqueProfileIds, prefetchProfiles } from '@/features/profile/utils/prefetchProfiles';
import { useLike } from './useLike';

const usePostRecord = (postId, post, authorProfile) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(post ? 'success' : 'loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) {
      setError('No post ID provided.');
      setStatus('error');
      return;
    }

    if (post) {
      setStatus('success');
      if (post.authorId && !authorProfile) {
        profileService
          .getProfile(post.authorId)
          .then((profile) => dispatch(setUserProfile(profile)))
          .catch(console.warn);
      }
      return;
    }

    let cancelled = false;

    const fetchPost = async () => {
      setStatus('loading');
      setError('');

      try {
        const fetchedPost = await postService.getPostById(postId);
        if (cancelled) return;

        if (!fetchedPost) {
          setError('Post not found.');
          setStatus('error');
          return;
        }

        dispatch(setPostDetail(fetchedPost));
        setStatus('success');

        if (fetchedPost.authorId) {
          profileService
            .getProfile(fetchedPost.authorId)
            .then((profile) => !cancelled && dispatch(setUserProfile(profile)))
            .catch(console.warn);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load post.');
          setStatus('error');
        }
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [postId, post, authorProfile, dispatch]);

  return {
    isPostLoading: status === 'loading',
    postFetchError: error,
  };
};

const usePostComments = (postId) => {
  const dispatch = useDispatch();
  const profileCache = useSelector((state) => state.profile.byId);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      return;
    }

    let cancelled = false;

    const fetchComments = async () => {
      setComments([]);
      try {
        const nextComments = await commentService.getCommentsByPost(postId);
        if (!cancelled) setComments(nextComments);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  useEffect(() => {
    if (comments.length === 0) return;

    const missingUserIds = getUniqueProfileIds(comments, (comment) =>
      profileCache[comment.userId] ? null : comment.userId,
    );

    prefetchProfiles(dispatch, missingUserIds, 'Commenter profile prefetch');
  }, [comments, profileCache, dispatch]);

  return {
    comments,
    profileCache,
  };
};

export const usePostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = useSelector((state) => selectPostById(state, id));
  const authUserId = useSelector(selectAuthUserId);
  const authorProfile = useSelector((state) => selectProfileById(state, post?.authorId));
  const currentUserProfile = useSelector((state) => selectProfileById(state, authUserId));

  const { isPostLoading, postFetchError } = usePostRecord(id, post, authorProfile);
  const { comments, profileCache } = usePostComments(post?.$id);
  const { likesCount, isLiked, isLikedLoading, isLiking, toggleLike } = useLike(post);

  const estimatedReadTime = calculateReadTime(post?.content);

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
    isPostLoading,
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
