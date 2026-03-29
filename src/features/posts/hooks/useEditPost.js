import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { postService } from '@/features/posts';
import { selectPostById, setPostDetail } from '@/features/posts';

export const useEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const post = useSelector((state) => selectPostById(state, id));

  const [formData, setFormData] = useState(null);
  const [postFetchStatus, setPostFetchStatus] = useState('loading');
  const [updateStatus, setUpdateStatus] = useState('idle');
  const [postFetchError, setPostFetchError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
      if (!id) {
        setPostFetchError('Invalid post ID.');
        setPostFetchStatus('error');
        return;
      }

      if (post) {
        setFormData({
          title: post.title || '',
          content: post.content || '',
          status: post.status || 'draft',
          coverImageUrl: post.coverImageUrl || null,
          coverImageId: post.coverImageId || null,
          category: post.category || null,
        });
        setPostFetchStatus('success');
        return;
      }

      setPostFetchStatus('loading');
      try {
        const fetchedPost = await postService.getPostById(id);
        if (cancelled) return;

        if (fetchedPost?.$id) {
          setFormData({
            title: fetchedPost.title || '',
            content: fetchedPost.content || '',
            status: fetchedPost.status || 'draft',
            coverImageUrl: fetchedPost.coverImageUrl || null,
            coverImageId: fetchedPost.coverImageId || null,
            category: fetchedPost.category || null,
          });
          dispatch(setPostDetail(fetchedPost));
          setPostFetchStatus('success');
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

    loadPost();
    return () => {
      cancelled = true;
    };
  }, [id, post, dispatch]);

  const handleUpdate = useCallback(
    async (formValues) => {
      if (!id) return;
      if (!formValues.title?.trim() || !formValues.content?.trim()) {
        toast.error('Title and content are required.');
        return;
      }
      if (updateStatus === 'loading') return;

      setUpdateStatus('loading');
      setPostFetchError('');

      try {
        const updatedPost = await postService.updatePost(id, {
          title: formValues.title.trim(),
          content: formValues.content.trim(),
          status: formValues.status || 'draft',
          coverImageId: formValues.coverImageId || null,
          coverImageUrl: formValues.coverImageUrl || null,
          category: formValues.category || null,
        });

        if (updatedPost?.$id) {
          dispatch(setPostDetail(updatedPost));
          setUpdateStatus('success');
          toast.success('Post updated successfully!');
          navigate('/dashboard');
        } else {
          throw new Error('Failed to update post.');
        }
      } catch (error) {
        console.error('Update failed:', error);
        setUpdateStatus('error');
        const msg = error?.message || 'Failed to update post';
        toast.error(msg);
        setPostFetchError(msg);
      }
    },
    [id, dispatch, navigate, updateStatus],
  );

  return {
    formData,
    isPostLoading: postFetchStatus === 'loading',
    isPostUpdating: updateStatus === 'loading',
    postFetchError,
    handleUpdate,
    navigate,
  };
};
