import { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const isLoggedIn = !!user;
  if (!isLoggedIn) navigate('/login');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Latest Posts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-700 mt-2">
                {post.content.length > 100
                  ? post.content.slice(0, 100) + '...'
                  : post.content}
              </p>
              <div className="text-sm text-gray-500 mt-2">
                By <b>{post.authorId}</b> on{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <Link
                to={`/posts/${post.$id}`}
                className="text-blue-600 text-sm inline-block mt-2 hover:underline"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
