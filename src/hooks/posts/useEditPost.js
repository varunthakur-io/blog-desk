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

  const post = useSelector((state) => selectPostById(state, id));

  const [formData, setFormData] = useState(null);
  const [fetchStatus, setFetchStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      if (!id) {
        setError('Invalid post ID.');
        setFetchStatus('error');
        return;
      }

      if (post) {
        setFormData({
          title: post.title || '',
          content: post.content || '',
          category: post.category || '',
          published: post.published ?? true,
          postImageURL: post.postImageURL || null,
        });
        setFetchStatus('success');
        return;
      }

      setFetchStatus('loading');
      try {
        const data = await postService.getPostById(id);
        if (!mounted) return;

        if (data && data.$id) {
          setFormData({
            title: data.title || '',
            content: data.content || '',
            category: data.category || '',
            published: data.published ?? true,
            postImageURL: data.postImageURL || null,
          });
          dispatch(setPostDetail(data));
          setFetchStatus('success');
        } else {
          setError('Post not found.');
          setFetchStatus('error');
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load post.');
          setFetchStatus('error');
        }
      }
    };

    loadPost();
    return () => { mounted = false; };
  }, [id, post, dispatch]);

  const handleUpdate = useCallback(async (data) => {
    if (!id) return;
    if (!data.title?.trim() || !data.content?.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    if (submitStatus === 'submitting') return;

    setSubmitStatus('submitting');
    setError('');

    try {
      const updatedPost = await postService.updatePost(id, {
        title: data.title.trim(),
        content: data.content.trim(),
        category: data.category || 'Uncategorized',
        published: data.published ?? true,
        postImageURL: data.postImageURL || null,
      });

      if (updatedPost && updatedPost.$id) {
        dispatch(setPostDetail(updatedPost));
        setSubmitStatus('success');
        toast.success('Post updated successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Failed to update post.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setSubmitStatus('error');
      const msg = err?.message || 'Failed to update post';
      toast.error(msg);
      setError(msg);
    }
  }, [id, dispatch, navigate, submitStatus]);

  return {
    formData,
    isLoading: fetchStatus === 'loading',
    isSaving: submitStatus === 'submitting',
    error,
    handleUpdate,
    navigate,
  };
};
