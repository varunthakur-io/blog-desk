import { useEffect, useMemo, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Search } from 'lucide-react';

// UI Components
// import Loader, { Spinner } from '@/components/Loader';
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
import PostCardSkeleton from '@/components/skeletons/PostCardSkeleton';

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

  // Load a page of posts (page 1 = fresh load, >1 = append)
  const loadPage = useCallback(
    async (pageNum) => {
      dispatch(setPostsLoading(true));
      dispatch(setPostsError(null));

      try {
        const data = await postService.getAllPosts(pageNum, LIMIT);
        const docs = data.documents ?? [];
        const totalFetched = (pageNum - 1) * LIMIT + docs.length;

        dispatch(pageNum === 1 ? setPosts(docs) : appendPosts(docs));
        dispatch(setPage(pageNum));
        dispatch(setHasMore(totalFetched < data.total));
      } catch (err) {
        dispatch(setPostsError(err?.message ?? 'Failed to fetch posts'));
      } finally {
        dispatch(setPostsLoading(false));
      }
    },
    [dispatch],
  );

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 150 &&
        !loading &&
        hasMore
      ) {
        loadPage(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page, loadPage]);

  // Initial load (run only once)
  useEffect(() => {
    if (!initialLoaded) {
      loadPage(1);
      dispatch(setInitialLoaded(true));
    }
  }, [initialLoaded, loadPage, dispatch]);

  // Client-side search filter
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;

    const q = searchTerm.toLowerCase();
    return posts.filter((post) => {
      const title = post.title?.toLowerCase() ?? '';
      const content = post.content?.toLowerCase() ?? '';
      return title.includes(q) || content.includes(q);
    });
  }, [posts, searchTerm]);

  const renderContent = () => {
    // First load – show full-screen skeletons
    if (loading && posts.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
          {filteredPosts.map((post) => (
            <PostCard key={post.$id} post={post} />
          ))}

          {loading && hasMore && (
            <>
              {Array.from({ length: LIMIT }).map((_, i) => (
                <PostCardSkeleton key={`skeleton-${i}`} />
              ))}
            </>
          )}
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

    // Empty state (no posts or no search results)
    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-32">
          <div className="flex flex-col items-center space-y-6">
            {searchTerm ? (
              <Search className="h-24 w-24 text-muted-foreground/40" />
            ) : (
              <BookOpen className="h-24 w-24 text-muted-foreground/40" />
            )}
            <h3 className="text-2xl font-semibold">
              {searchTerm ? 'No Results Found' : 'No Posts Yet'}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {searchTerm
                ? `We couldn't find any posts matching "${searchTerm}".`
                : 'There are no posts to display right now.'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <NavLink to="/create">Create Your First Post</NavLink>
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        {searchTerm && (
          <p className="text-center text-muted-foreground">
            Found {filteredPosts.length}{' '}
            {filteredPosts.length === 1 ? 'post' : 'posts'} for "{searchTerm}"
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Actual posts */}
          {filteredPosts.map((post) => (
            <PostCard key={post.$id} post={post} />
          ))}

          {/* Skeletons while loading next page */}
          {loading && hasMore && (
            <>
              {[...Array(LIMIT)].map((_, i) => (
                <PostCardSkeleton key={`skeleton-${i}`} />
              ))}
            </>
          )}
        </div>
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
      <div className="py-4">{renderContent()}</div>
    </div>
  );
};

export default Home;
