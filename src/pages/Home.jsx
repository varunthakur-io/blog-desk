import { NavLink } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';

// UI Components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostCard, FeaturedPost, PostCardSkeleton } from '@/components/posts';

// Hooks
import { useHome } from '@/hooks/posts';

const Home = () => {
  const { posts, loading, error, hasMore, searchTerm, handleSearchChange, LIMIT } = useHome();

  const renderContent = () => {
    if (loading && posts.length === 0) {
      return (
        <div className="space-y-10">
          <div className="w-full h-96 rounded-3xl bg-muted animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
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

    if (posts.length === 0) {
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

    const showFeatured = !searchTerm && posts.length > 0;
    const featuredPost = showFeatured ? posts[0] : null;
    const gridPosts = showFeatured ? posts.slice(1) : posts;

    return (
      <div className="space-y-12">
        {searchTerm && (
          <p className="text-center text-muted-foreground">
            Found {posts.length} {posts.length === 1 ? 'post' : 'posts'} for "{searchTerm}"
          </p>
        )}

        {featuredPost && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FeaturedPost post={featuredPost} />
          </section>
        )}

        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {gridPosts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}

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
      <section className="mx-auto flex flex-col items-center gap-4 pb-8 md:pb-12 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Build your digital presence.
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          A minimal blog platform built for developers and creators. Share your ideas, code, and
          stories with the world.
        </p>

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

      <div className="py-6">{renderContent()}</div>
    </div>
  );
};

export default Home;
