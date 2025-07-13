import { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import { useNavigate } from 'react-router-dom';
import PostItem from '../components/PostItem';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await postService.getAllPosts();
        const user = await postService.account.get(); // Get current user

        // Filter posts by user ID
        const userPosts = allPosts.filter((post) => post.authorId === user.$id);
        setPosts(userPosts);
      } catch (err) {
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handlers for Edit/Delete actions
  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(postId);
        setPosts(posts.filter((post) => post.$id !== postId));
        // Success notification
      } catch (error) {
        console.error('Failed to delete post:', error.message);
        // Error notification
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Blog Posts</h1>
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + New Post
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-600">You haven't written any posts yet.</p>
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
