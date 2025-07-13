import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch post on mount
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

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Post title"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Post content"
          className="w-full p-2 border rounded h-40"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Post
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default EditPost;
