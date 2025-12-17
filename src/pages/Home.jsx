import { useEffect, useMemo, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Search } from 'lucide-react';

// UI Components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/PostCard';
import FeaturedPost from '@/components/FeaturedPost';

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
const CATEGORIES = [
  'All', // Special category to show all posts
  'Technology',
  'Lifestyle',
  'Travel',
  'Programming',
  'Thoughts',
  'Science',
  'Art',
  'Health',
];

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
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load a page of posts (page 1 = fresh load, >1 = append)
  const loadPage = useCallback(
    async (pageNum, categoryFilter = null) => {
      dispatch(setPostsLoading(true));
      dispatch(setPostsError(null));

      try {
        const data = await postService.getAllPosts(
          pageNum,
          LIMIT,
          categoryFilter === 'All' ? null : categoryFilter,
        );
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

  // Effect for initial load or category change
  useEffect(() => {
    // If category changes, reset pagination and load first page
    dispatch(setPage(1));
    loadPage(1, selectedCategory);
  }, [selectedCategory, loadPage, dispatch]);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 150 &&
        !loading &&
        hasMore &&
        !searchTerm // Disable infinite scroll if search is active
      ) {
        loadPage(page + 1, selectedCategory);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page, loadPage, searchTerm, selectedCategory]);

  // Initial load (run only once if no category selected)
  useEffect(() => {
    if (!initialLoaded && selectedCategory === 'All') {
      loadPage(1, selectedCategory);
      dispatch(setInitialLoaded(true));
    }
  }, [initialLoaded, loadPage, dispatch, selectedCategory]);

  // Client-side search filter
  const filteredPosts = useMemo(() => {
    // If a category is selected, filtering is done on the server-side
    // This client-side filter only applies if no category is selected OR if searchTerm is present
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return posts.filter((post) => {
        const title = post.title?.toLowerCase() ?? '';
        const content = post.content?.toLowerCase() ?? '';
        return title.includes(q) || content.includes(q);
      });
    }
    return posts;
  }, [posts, searchTerm]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Clear search when category changes
    dispatch(setInitialLoaded(false)); // Force reload with new category
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCategory('All'); // Clear category when search changes
    dispatch(setInitialLoaded(false)); // Force reload with new search
  };

  const renderContent = () => {
    // First load – show full-screen skeletons
    if (loading && posts.length === 0) {
      return (
        <div className="space-y-10">
          {/* Simulate featured skeleton */}
          <div className="w-full h-96 rounded-3xl bg-muted animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
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

    // Determine if we should show the Featured Post layout
    const showFeatured = !searchTerm && filteredPosts.length > 0;

    const featuredPostNo = showFeatured
      ? Math.floor(Math.random() * filteredPosts.length)
      : null;

    const featuredPost = showFeatured ? filteredPosts[featuredPostNo] : null;

    const gridPosts = showFeatured
      ? filteredPosts.filter((_, index) => index !== featuredPostNo)
      : filteredPosts;

    return (
      <div className="space-y-12">
        {searchTerm && (
          <p className="text-center text-muted-foreground">
            Found {filteredPosts.length}{' '}
            {filteredPosts.length === 1 ? 'post' : 'posts'} for "{searchTerm}"
          </p>
        )}

        {/* Featured Section */}
        {featuredPost && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FeaturedPost post={featuredPost} />
          </section>
        )}

        {/* Grid Section */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {gridPosts.map((post) => (
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
        )}
      </div>
    );
  };

  return (
    <div className="relative h-full">
      {/* Hero Section */}
      <section className="mx-auto flex flex-col items-center gap-4 pb-8 md:pb-12 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Build your digital presence.
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          A minimal blog platform built for developers and creators. Share your
          ideas, code, and stories with the world.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md md:max-w-sm items-center space-x-2 pt-4">
          <div className="rounded-xl border border-border/60 bg-card/60 shadow-sm px-3 py-2 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'secondary'}
            className="cursor-pointer px-4 py-1.5 text-sm transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Content Section */}
      <div className="py-6">{renderContent()}</div>
    </div>
  );
};

export default Home;
