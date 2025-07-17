import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { postService } from '../services/postService';
import { markStale, setError, setLoading, setPosts } from '../store/postSlice';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector((state) => state.posts);

  const [formData, setFormData] = useState({ title: '', content: '' });

  // Find the current post in Redux state
  const currentPostFromRedux = posts.find((post) => post.$id == id);

  // Fetch the post data when component mounts or id changes
  useEffect(() => {
    const fetchAndSetPost = async () => {
      if (!id) {
        dispatch(setError('No post ID provided for editing.'));
        console.error('No post ID provided for editing.');
        return;
      }

      // If the post is already in Redux, use it to populate form
      if (currentPostFromRedux) {
        setFormData({
          title: currentPostFromRedux.title,
          content: currentPostFromRedux.content,
        });
        return; // Don't fetch if already available
      }

      // If not in Redux, fetch it from the service
      try {
        dispatch(setLoading(true));
        const data = await postService.getPostById(id);

        if (data) {
          setFormData({
            title: data.title,
            content: data.content,
          });
        } else {
          dispatch(setError('Post not found.'));
          console.error('Post not found for ID:', id);
        }
      } catch (err) {
        dispatch(setError(err.message || 'Failed to fetch post.'));
        console.error('Error fetching post:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAndSetPost();
  }, [id, dispatch, currentPostFromRedux]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission to update the post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      dispatch(setError('Cannot update: No post ID.'));
      return;
    }
    try {
      const responseData = await postService.updatePost(id, formData);
      console.log('Post update response:', responseData);

      if (responseData && responseData.$id) {
        // Create a new array with the updated post
        const updatedPostsArray = posts.map((post) =>
          String(post.$id) === String(responseData.$id) ? responseData : post
        );
        // Dispatch setPosts with the new array
        dispatch(setPosts(updatedPostsArray));
        dispatch(markStale());
      }

      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err.message || 'Failed to update post'));
      console.error('Error updating post:', err);
    }
  };

  if (loading)
    return (
      <p className="text-center py-4 text-gray-700 dark:text-gray-300">
        Loading...
      </p>
    );

  // Display error if fetching failed AND there's no data to show
  if (error && !formData.title && !formData.content) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-950">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  // If we are here and formData is empty, it means post wasn't found or still loading
  // You might want a specific "Post not found" message here if `currentPostFromRedux` is null and not loading
  if (!formData.title && !formData.content && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-700 dark:text-gray-300">
          Post not found or invalid ID.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Edit Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post title"
            className="w-full p-2 border rounded text-gray-900 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Post content"
            className="w-full p-2 border rounded h-40 text-gray-900 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Update Post
          </button>

          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditPost;
