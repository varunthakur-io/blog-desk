import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { postService } from '@/services/posts';
import { selectPostById, upsertPost } from '@/store/posts';

export const useEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const post = useSelector((state) => selectPostById(state, id));

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      if (!id) {
        setError('Invalid post ID.');
        setIsLoading(false);
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
        setIsLoading(false);
        return;
      }

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
          dispatch(upsertPost(data));
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load post.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadPost();
    return () => { mounted = false; };
  }, [id, post, dispatch]);

  const handleUpdate = async (data) => {
    if (!id) return;
    if (!data.title.trim() || !data.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const updatedPost = await postService.updatePost(id, data);
      if (updatedPost && updatedPost.$id) {
        dispatch(upsertPost(updatedPost));
        toast.success('Post updated successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Failed to update post.');
      }
    } catch (err) {
      const msg = err.message || 'Failed to update post';
      toast.error(msg);
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    isLoading,
    isSaving,
    error,
    handleUpdate,
    navigate,
  };
};
