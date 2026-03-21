import { NavLink } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Sparkles, Tag, X } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostCard, FeaturedPost, PostCardSkeleton } from '@/components/posts';

import { useHome } from '@/hooks/posts';
import { CATEGORIES } from '@/constants';

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
    LIMIT,
  } = useHome();

  const renderContent = () => {
    if (postsLoading && posts.length === 0) {
      return (
        <div className="space-y-10">
          <div className="w-full h-96 rounded-2xl bg-muted animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={`skeleton-${i}`} />
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
        <div className="text-center py-32">
          <div className="flex flex-col items-center gap-5">
            <div className="rounded-full bg-muted p-6">
              {searchTerm || activeCategory ? (
                <Search className="h-10 w-10 text-muted-foreground/50" />
              ) : (
                <BookOpen className="h-10 w-10 text-muted-foreground/50" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight">
                {searchTerm || activeCategory ? 'No Results Found' : 'No Posts Yet'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                {searchTerm
                  ? `Nothing matched "${searchTerm}". Try a different keyword.`
                  : activeCategory
                  ? `No posts in "${activeCategory}" yet.`
                  : 'Be the first to share your ideas with the world.'}
              </p>
            </div>
            {activeCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCategoryChange(activeCategory)}
                className="rounded-full gap-2"
              >
                <X className="h-3.5 w-3.5" /> Clear filter
              </Button>
            )}
            {!searchTerm && !activeCategory && (
              <Button asChild className="rounded-full px-6 mt-2">
                <NavLink to="/create">
                  Write First Post <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
            )}
          </div>
        </div>
      );
    }

    const showFeatured = !searchTerm && !activeCategory && posts.length > 0;
    const featuredPost = showFeatured ? posts[0] : null;
    const gridPosts = showFeatured ? posts.slice(1) : posts;

    return (
      <div className="space-y-14">
        {(searchTerm || activeCategory) && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span>
              <span className="font-semibold text-foreground">{posts.length}</span>{' '}
              {posts.length === 1 ? 'post' : 'posts'}
              {activeCategory && (
                <> in <span className="font-semibold text-foreground">{activeCategory}</span></>
              )}
              {searchTerm && (
                <> matching <span className="font-semibold text-foreground">&ldquo;{searchTerm}&rdquo;</span></>
              )}
            </span>
            {activeCategory && (
              <button
                onClick={() => handleCategoryChange(activeCategory)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        )}

        {featuredPost && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FeaturedPost post={featuredPost} />
          </section>
        )}

        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {gridPosts.map((post) => (
              <PostCard key={post.$id} post={post} />
            ))}
            {postsLoading && hasMore && (
              <>
                {[...Array(LIMIT)].map((_, i) => (
                  <PostCardSkeleton key={`skeleton-more-${i}`} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-root relative">
      {/* Hero */}
      <section className="mx-auto flex flex-col items-center gap-5 pb-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          Open platform for writers &amp; developers
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-[4rem]">
          Ideas worth <span className="gradient-brand">sharing.</span>
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
          A minimal, distraction-free blog platform built for creators and developers. Write,
          publish, and connect.
        </p>

        {/* Search */}
        <div className="w-full max-w-sm mt-1">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-foreground/20 transition-all">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="search"
              placeholder="Search posts…"
              className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 text-sm bg-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </section>

      {/* Category filter bar */}
      <div className="mb-10">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => activeCategory && handleCategoryChange(activeCategory)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 ${
              !activeCategory
                ? 'bg-foreground text-background border-foreground shadow-sm'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
            }`}
          >
            <Tag className="h-3 w-3" />
            All
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                  isActive
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-card'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

export default Home;
