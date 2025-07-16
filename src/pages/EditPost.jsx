import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await postService.getPostById(id);
        setFormData({ title: post.title, content: post.content });
      } catch (err) {
        setError('Failed to load post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postService.updatePost(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
    }
  };

  if (loading)
    return (
      <p className="text-center py-4 text-gray-700 dark:text-gray-300">
        Loading...
      </p>
    );

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
