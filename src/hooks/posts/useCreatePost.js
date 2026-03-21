import { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postService } from '@/services/posts';
import { setPostDetail } from '@/store/posts';
import { selectAuthUserId } from '@/store/auth';

export const useCreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);
  const [createStatus, setCreateStatus] = useState('idle');

  // using a ref instead of checking createStatus inside the callback
  // because createStatus was in the useCallback deps which caused a new function
  // reference on every status change — which could lead to double-submits on fast clicks
  const isSubmittingRef = useRef(false);

  const handleCreatePost = useCallback(
    async (formData) => {
      // basic guards before hitting appwrite
      if (!authUserId) {
        toast.error('You must be logged in to create a post.');
        return;
      }
      if (!formData.title?.trim() || !formData.content?.trim()) {
        toast.error('Title and content are required.');
        return;
      }

      // prevent double-submit if someone clicks publish twice quickly
      if (isSubmittingRef.current) return;

      isSubmittingRef.current = true;
      setCreateStatus('loading');

      try {
        const newPost = await postService.createPost({
          title:        formData.title.trim(),
          content:      formData.content.trim(),
          status:       formData.status       || 'draft',
          coverImageId: formData.coverImageId  || null,
          coverImageUrl: formData.coverImageUrl || null,
          category:     formData.category      || null,
        });

        // cache the new post in redux so it shows up immediately on dashboard/post detail
        if (newPost) dispatch(setPostDetail(newPost));

        toast.success('Post published successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Create post error:', error);
        setCreateStatus('error');
        toast.error(error?.message || 'Failed to create post. Please try again.');
      } finally {
        // always reset the lock and status whether it succeeded or failed
        isSubmittingRef.current = false;
        setCreateStatus('idle');
      }
    },
    // removed createStatus from deps — the ref handles the guard now
    [authUserId, dispatch, navigate],
  );

  return {
    handleCreatePost,
    isPostCreating: createStatus === 'loading',
  };
};
