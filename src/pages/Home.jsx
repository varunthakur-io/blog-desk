import { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard'; // Ensure PostCard is updated for dark mode

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
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-blue-600 p-6 sm:p-10 dark:bg-gray-950 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-12 text-gray-900 text-center tracking-tight leading-tight dark:text-gray-100">
          Explore Our Latest Insights
        </h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse rounded-full h-16 w-16 bg-blue-200 mx-auto dark:bg-blue-800"></div>
            <p className="mt-6 text-gray-600 text-lg dark:text-gray-400">
              Fetching compelling stories...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-xl dark:text-gray-400">
            No articles found yet. Be the first to publish something amazing!
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 xl:gap-10">
            {posts.map((post) => (
              <div key={post.$id} className="mb-8 break-inside-avoid-column">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
