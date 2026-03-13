import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postService } from '@/services/posts';
import { setPost } from '@/store/posts';
import { selectAuthUserId } from '@/store/auth';

export const useCreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'error'

  const handleCreatePost = useCallback(async (formData) => {
    if (!authUserId) {
      toast.error('You must be logged in to create a post.');
      return;
    }

    if (!formData.title?.trim() || !formData.content?.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    if (status === 'submitting') return;

    setStatus('submitting');

    try {
      const newPost = await postService.createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category || 'Uncategorized',
        published: formData.published ?? true,
        postImageURL: formData.postImageURL || null,
      });

      if (newPost) {
        dispatch(setPost(newPost));
      }

      setStatus('idle');
      toast.success('Post published successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Create post error:', error);
      setStatus('error');
      toast.error(error?.message || 'Failed to create post. Please try again.');
    }
  }, [authUserId, dispatch, navigate, status]);

  return {
    handleCreatePost,
    isSubmitting: status === 'submitting',
  };
};
