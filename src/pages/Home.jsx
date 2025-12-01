import { useEffect, useMemo, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Search } from 'lucide-react';

// UI Components
import Loader, { Spinner } from '@/components/Loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostCard from '@/components/PostCard';

// Services & Store
import { postService } from '@/services/postService';
import {
  appendPosts,
  selectAllPosts,
  selectInitialLoaded,
  setInitialLoaded,
  setPostsLoading,
  setPosts,
  setPostsError,
  selectPostsLoading,
  selectPostsError,
  selectHasMore,
  selectPage,
  setPage,
  setHasMore,
} from '@/store/postSlice';

const LIMIT = 6;

const Home = () => {
  const dispatch = useDispatch();

  // Selectors
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const hasMore = useSelector(selectHasMore);
  const page = useSelector(selectPage);
  const initialLoaded = useSelector(selectInitialLoaded);

  // Local search state (Home-only search)
  const [searchTerm, setSearchTerm] = useState('');

  // loadPage (Memoized)
  const loadPage = useCallback(
    async (pageNum) => {
      dispatch(setPostsLoading(true));
      dispatch(setPostsError(null));

      try {
        const data = await postService.getAllPosts(pageNum, LIMIT);
        const docs = Array.isArray(data) ? data : (data?.documents ?? []);

        dispatch(pageNum === 1 ? setPosts(docs) : appendPosts(docs));
        dispatch(setPage(pageNum));
        dispatch(setHasMore(docs.length === LIMIT));
      } catch (err) {
        dispatch(setPostsError(err?.message ?? 'Failed to fetch posts'));
      } finally {
        dispatch(setPostsLoading(false));
      }
    },
    [dispatch],
  );

  // Initial load / runs exactly once
  useEffect(() => {
    if (initialLoaded) return;
    loadPage(1);
    dispatch(setInitialLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Event handlers
  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    loadPage(nextPage);
  };

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;

    const query = searchTerm.toLowerCase();

    return posts.filter((post) => {
      const title = post.title?.toLowerCase() || '';
      const content = post.content?.toLowerCase() || '';

      return title.includes(query) || content.includes(query);
    });
  }, [posts, searchTerm]);

  const renderContent = () => {
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
      {/* Header + search bar row */}
      <div className="py-10 sm:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: hero text */}
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3">
              Stories &amp; Ideas
            </h1>
            <p className="text-lg text-muted-foreground">
              A minimal blog for creative minds. Explore and share your thoughts
              with the world.
            </p>
          </div>

          {/* Right: search bar card */}
          <div className="w-full max-w-md md:max-w-sm md:ml-auto">
            <div className="rounded-xl border border-border/60 bg-card/60 shadow-sm px-3 py-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {renderContent()}
    </div>
  );
};

export default Home;
