import { useState, useCallback } from 'react';
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
  const [submitStatus, setSubmitStatus] = useState('idle');

  const handleCreatePost = useCallback(
    async (formData) => {
      if (!authUserId) {
        toast.error('You must be logged in to create a post.');
        return;
      }

      if (!formData.title?.trim() || !formData.content?.trim()) {
        toast.error('Title and content are required.');
        return;
      }

      if (submitStatus === 'submitting') return;

      setSubmitStatus('submitting');

      try {
        const newPost = await postService.createPost({
          title: formData.title.trim(),
          content: formData.content.trim(),
          status: formData.status || 'draft',
          coverImageId: formData.coverImageId || null,
          coverImageUrl: formData.coverImageUrl || null,
        });

        if (newPost) {
          // Seed the posts store so the dashboard/detail views can render the new post immediately.
          dispatch(setPostDetail(newPost));
        }

        setSubmitStatus('idle');
        toast.success('Post published successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Create post error:', error);
        setSubmitStatus('error');
        toast.error(error?.message || 'Failed to create post. Please try again.');
      }
    },
    [authUserId, dispatch, navigate, submitStatus],
  );

  return {
    // submit action
    handleCreatePost,

    // loading state
    isSubmitting: submitStatus === 'submitting',
  };
};
