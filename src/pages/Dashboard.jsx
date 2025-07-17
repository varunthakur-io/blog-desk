import { useEffect } from 'react';
import { postService } from '../services/postService';
import { useNavigate } from 'react-router-dom';
import PostItem from '../components/PostItem';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading, setPosts } from '../store/postSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, fetched } = useSelector(
    (state) => state.posts
  );

  const navigate = useNavigate();

  // Fetch user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(setLoading(true));
        const data = await postService.getAllPosts();
        dispatch(setPosts(data));
      } catch (err) {
        dispatch(setError(err.message));
        console.error('Failed to fetch posts:', error);
      }
    };

    if (!fetched) fetchPosts();
  }, [dispatch, fetched, error]);

  // Handlers for Edit/Delete actions
  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(postId);
        setPosts(posts.filter((post) => post.$id !== postId));
      } catch (error) {
        console.error('Failed to delete post:', error.message);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-4 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Your Blog Posts
            </h1>
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              + New Post
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              You haven't written any posts yet.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostItem
                  key={post.$id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
