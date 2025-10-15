import { useEffect, useMemo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Search } from 'lucide-react';
import Loader, { Spinner } from '@/components/Loader';

// Components
import PostCard from '../components/PostCard';

// Services
import { postService } from '../services/postService';

// Redux
import {
  setError,
  setLoading,
  setPosts,
  addPosts,
  clearPosts,
} from '../store/postSlice';

// UI Components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, searchTerm, page, hasMore } = useSelector(
    (state) => state.posts,
  );

  // Fetch posts from the API
  const fetchPosts = useCallback(
    async (pageNum) => {
      try {
        dispatch(setLoading(true));
        const data = await postService.getAllPosts(pageNum);
      
        if (pageNum === 1) {
          dispatch(setPosts(data));
        } else {
          dispatch(addPosts(data));
        }
      } catch (err) {
        dispatch(setError(err.message || 'Failed to fetch posts'));
        console.error('Failed to fetch posts:', err);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  // Clear posts on component mount and fetch initial posts
  useEffect(() => {
    dispatch(clearPosts());
    fetchPosts(1);

    // Cleanup function to clear posts on component unmount
    return () => {
      dispatch(clearPosts());
    };
  }, [dispatch, fetchPosts]);

  // handle load more button click
  const handleLoadMore = () => {
    // guard: don't fire if already loading or nothing more to load
    if (loading || !hasMore) return;
    fetchPosts(page + 1);
  };

  // filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm) {
      return posts;
    }
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [posts, searchTerm]);

  // render content based on state
  const renderContent = () => {
    // Loading state
    if (loading && posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-32">
          <Loader
            text="Loading posts..."
            size={48}
            className="flex-col gap-4 py-0"
            textClassName="text-lg"
          />
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex justify-center py-20">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      );
    }

    // No posts state
    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-32">
          <div className="flex flex-col items-center space-y-4">
            {searchTerm ? (
              <Search className="h-20 w-20 text-muted-foreground/50" />
            ) : (
              <BookOpen className="h-20 w-20 text-muted-foreground/50" />
            )}
            <h3 className="text-2xl font-semibold">
              {searchTerm ? 'No Results Found' : 'No Posts Yet'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm
                ? `We couldn't find any posts matching "${searchTerm}". Try a different search.`
                : 'There are no posts to display right now. Why not be the first to create one?'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <NavLink to="/create">Create Post</NavLink>
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {searchTerm && (
          <div className="text-center">
            <p className="text-muted-foreground">
              Found {filteredPosts.length}{' '}
              {filteredPosts.length === 1 ? 'post' : 'posts'} for &quot;
              {searchTerm}&quot;
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.$id} post={post} />
          ))}
        </div>
        {hasMore && !searchTerm && (
          <div className="text-center">
            <Button onClick={handleLoadMore} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size={16} className="mr-2 text-current" /> Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      {!searchTerm && (
        <div className="text-center py-20 sm:py-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Stories & Ideas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A minimal blog for creative minds. Explore and share your thoughts
            with the world.
          </p>
        </div>
      )}

      {/* Content Section */}
      {renderContent()}
    </div>
  );
};

export default Home;
