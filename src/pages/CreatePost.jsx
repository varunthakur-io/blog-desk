import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PostForm from '@/components/PostForm';

// Services and Store
import { postService } from '@/services/postService';
import { upsertPost } from '@/store/postSlice';
import { selectAuthUserId } from '@/store/authSlice';

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUserId = useSelector(selectAuthUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async (formData) => {
    if (!authUserId) {
      toast.error('You must be logged in to create a post.');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost = await postService.createPost({
        title: formData.title,
        content: formData.content,
      });

      if (newPost) {
        dispatch(upsertPost(newPost));
      }

      toast.success('Post published successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PostForm
        mode="create"
        onSubmit={handleCreatePost}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CreatePost;
