import { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-12 text-gray-900 text-center tracking-tight leading-tight">
          Explore Our Latest Insights
        </h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse rounded-full h-16 w-16 bg-blue-200 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">
              Fetching compelling stories...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-xl">
            No articles found yet. Be the first to publish something amazing!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 items-start">
            {posts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
