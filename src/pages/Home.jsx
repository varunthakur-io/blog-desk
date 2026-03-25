import { Loader2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PostCard, PostCardSkeleton, BentoGrid } from '@/components/posts';
import { useHome } from '@/hooks/posts';
import { HomeHeader, HomeCategoryFilters, EmptyHomeState } from './HomeUI';

const Home = () => {
  const {
    posts,
    postsLoading,
    postsError,
    hasMore,
    searchTerm,
    activeCategory,
    handleSearchChange,
    handleCategoryChange,
  } = useHome();

  const renderContent = () => {
    if (postsLoading && posts.length === 0) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 lg:row-span-2 rounded-xl bg-muted animate-pulse min-h-[420px]" />
            <div className="rounded-xl bg-muted animate-pulse min-h-[196px]" />
            <div className="rounded-xl bg-muted animate-pulse min-h-[196px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      );
    }

    if (postsError) {
      return (
        <div className="flex justify-center py-20">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{postsError}</AlertDescription>
          </Alert>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <EmptyHomeState
          searchTerm={searchTerm}
          activeCategory={activeCategory}
          onClearFilters={() => handleCategoryChange(null)}
        />
      );
    }

    // search/filter view — plain grid, no bento
    if (searchTerm || activeCategory) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span>
              <span className="font-semibold text-foreground">{posts.length}</span>{' '}
              {posts.length === 1 ? 'post' : 'posts'}
              {activeCategory && (
                <>
                  {' '}
                  in <span className="font-semibold text-foreground">{activeCategory}</span>
                </>
              )}
              {searchTerm && (
                <>
                  {' '}
                  matching{' '}
                  <span className="font-semibold text-foreground">&ldquo;{searchTerm}&rdquo;</span>
                </>
              )}
            </span>
            {activeCategory && (
              <button
                onClick={() => handleCategoryChange(null)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
          </div>
          {postsLoading && hasMore && (
            <div className="flex justify-center pt-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      );
    }

    // normal view — bento grid top, uniform grid below
    const gridPosts = posts.slice(3);

    return (
      <div className="space-y-10">
        <BentoGrid posts={posts.slice(0, 3)} />

        {gridPosts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                {gridPosts.length} more {gridPosts.length === 1 ? 'post' : 'posts'}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </div>
          </div>
        )}

        {postsLoading && hasMore && (
          <div className="flex justify-center pt-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-root">
      <HomeHeader searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <HomeCategoryFilters
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      {renderContent()}
    </div>
  );
};

export default Home;
