import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('No post ID provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setPost(null);
      try {
        const fetchedPost = await postService.getPostById(id);

        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Post not found.');
          console.log('Post not found for ID:', id);
        }
      } catch (err) {
        setError('Failed to load post. Please try again.');
        console.error('Error details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6 sm:px-10 dark:bg-gray-950 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Loading article...
          </p>
        </div>
      </div>
    );
  }
  // Handle error or no post found
  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 py-12 px-6 sm:px-10 text-center dark:bg-red-950 dark:from-red-900 dark:to-red-950">
        <h2 className="text-3xl font-bold text-red-700 mb-4 dark:text-red-300">
          Oops!
        </h2>
        <p className="text-xl text-red-600 mb-6 dark:text-red-400">
          {error || 'The article you are looking for does not exist.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  // --- Main Post Details UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6 sm:px-10 font-sans dark:bg-gray-950 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight dark:text-gray-100">
          {post.title}
        </h1>

        <div className="flex items-center text-gray-600 text-md mb-8 border-b pb-4 border-gray-100 dark:text-gray-400 dark:border-gray-700">
          <span className="font-semibold text-blue-600 mr-2 dark:text-blue-400">
            By {post.authorName}
          </span>
          <span className="text-gray-400">•</span>
          <span className="ml-2">
            Published on{' '}
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed dark:text-gray-200 dark:prose-invert">
          <p>{post.content}</p>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 dark:text-blue-400 dark:bg-blue-900 dark:hover:bg-blue-800 dark:focus:ring-offset-gray-900"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
