import { Loader2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PostCard, PostCardSkeleton, BentoGrid, useCategories } from '@/features/posts';
import { useHome } from '@/features/posts';
import { HomeHeader, HomeTabs, HomeCategoryFilters, EmptyHomeState } from './HomeUI';

const Home = () => {
  const { categories } = useCategories();
  const {
    posts,
    postsLoading,
    postsError,
    hasMore,
    searchTerm,
    activeCategory,
    feedMode,
    authUserId,
    handleSearchChange,
    handleCategoryChange,
    handleFeedModeChange,
  } = useHome();

  const renderContent = () => {
    if (postsLoading && posts.length === 0) {
      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          {feedMode === 'explore' && !activeCategory && !searchTerm && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 lg:row-span-2 rounded-2xl bg-muted animate-pulse min-h-[420px]" />
              <div className="rounded-2xl bg-muted animate-pulse min-h-[196px]" />
              <div className="rounded-2xl bg-muted animate-pulse min-h-[196px]" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      );
    }

    if (postsError) {
      return (
        <div className="flex justify-center py-20">
          <Alert variant="destructive" className="max-w-md shadow-lg border-destructive/20 bg-destructive/5 rounded-2xl">
            <AlertTitle className="font-bold">Error loading feed</AlertTitle>
            <AlertDescription className="opacity-90">{postsError}</AlertDescription>
          </Alert>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <EmptyHomeState
          searchTerm={searchTerm}
          activeCategory={activeCategory}
          feedMode={feedMode}
          onClearFilters={() => {
            if (feedMode === 'following') handleFeedModeChange('explore');
            else handleCategoryChange(null);
          }}
        />
      );
    }

    // search/filter view OR Following Feed — plain grid
    if (searchTerm || activeCategory || feedMode === 'following') {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          {(searchTerm || activeCategory) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap mb-4 bg-muted/20 w-fit px-3 py-1.5 rounded-lg border border-border/40">
              <span className="font-medium">
                Showing <span className="text-foreground">{posts.length}</span> results
                {activeCategory && <> in <span className="text-primary">{activeCategory}</span></>}
                {searchTerm && <> for &ldquo;{searchTerm}&rdquo;</>}
              </span>
              <button
                onClick={() => handleCategoryChange(null)}
                className="ml-1 inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors font-bold text-primary/70"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 items-start">
            {posts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
          </div>
          {postsLoading && hasMore && (
            <div className="flex justify-center pt-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
            </div>
          )}
        </div>
      );
    }

    // normal explore view — bento grid top
    const gridPosts = posts.slice(3);

    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <BentoGrid posts={posts.slice(0, 3)} />

        {gridPosts.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">
                Latest Updates
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border via-border/40 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 items-start">
              {gridPosts.map((post) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </div>
          </div>
        )}

        {postsLoading && hasMore && (
          <div className="flex justify-center pt-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-root max-w-7xl mx-auto px-4 sm:px-6">
      <HomeHeader searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 mb-10 pb-4">
        <HomeTabs 
          activeMode={feedMode} 
          onModeChange={handleFeedModeChange} 
          isAuthenticated={!!authUserId} 
        />
        <div className="hidden md:block">
          <HomeCategoryFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      <div className="md:hidden mb-8">
        <HomeCategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <main className="pb-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default Home;
