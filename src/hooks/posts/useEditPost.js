import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { postService } from '@/services/posts';
import { selectPostById, setPostDetail } from '@/store/posts';

export const useEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Prefer the cached post when available so the form can hydrate instantly.
  const post = useSelector((state) => selectPostById(state, id));

  const [formData, setFormData] = useState(null);
  const [fetchStatus, setFetchStatus] = useState('loading');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      if (!id) {
        setFetchError('Invalid post ID.');
        setFetchStatus('error');
        return;
      }

      if (post) {
        setFormData({
          title: post.title || '',
          content: post.content || '',
          status: post.status || 'draft',
          coverImageUrl: post.coverImageUrl || null,
          coverImageId: post.coverImageId || null,
        });
        setFetchStatus('success');
        return;
      }

      setFetchStatus('loading');
      try {
        const fetchedPost = await postService.getPostById(id);
        if (!mounted) return;

        if (fetchedPost && fetchedPost.$id) {
          // Mirror server data into Redux so later detail/dashboard views reuse the fresh copy.
          setFormData({
            title: fetchedPost.title || '',
            content: fetchedPost.content || '',
            status: fetchedPost.status || 'draft',
            coverImageUrl: fetchedPost.coverImageUrl || null,
            coverImageId: fetchedPost.coverImageId || null,
          });
          dispatch(setPostDetail(fetchedPost));
          setFetchStatus('success');
        } else {
          setFetchError('Post not found.');
          setFetchStatus('error');
        }
      } catch (error) {
        if (mounted) {
          setFetchError(error?.message || 'Failed to load post.');
          setFetchStatus('error');
        }
      }
    };

    loadPost();
    return () => {
      mounted = false;
    };
  }, [id, post, dispatch]);

  const handleUpdate = useCallback(
    async (formValues) => {
      if (!id) return;
      if (!formValues.title?.trim() || !formValues.content?.trim()) {
        toast.error('Title and content are required.');
        return;
      }

      if (submitStatus === 'submitting') return;

      setSubmitStatus('submitting');
      setFetchError('');

      try {
        // Send only the editable fields; postService handles slug regeneration when title changes.
        const updatedPost = await postService.updatePost(id, {
          title: formValues.title.trim(),
          content: formValues.content.trim(),
          status: formValues.status || 'draft',
          coverImageId: formValues.coverImageId || null,
          coverImageUrl: formValues.coverImageUrl || null,
        });

        if (updatedPost && updatedPost.$id) {
          dispatch(setPostDetail(updatedPost));
          setSubmitStatus('success');
          toast.success('Post updated successfully!');
          navigate('/dashboard');
        } else {
          throw new Error('Failed to update post.');
        }
      } catch (error) {
        console.error('Update failed:', error);
        setSubmitStatus('error');
        const msg = error?.message || 'Failed to update post';
        toast.error(msg);
        setFetchError(msg);
      }
    },
    [id, dispatch, navigate, submitStatus],
  );

  return {
    // form data
    formData,

    // loading states
    isLoading: fetchStatus === 'loading',
    isSaving: submitStatus === 'submitting',

    // error state
    error: fetchError,

    // actions
    handleUpdate,
    navigate,
  };
};
