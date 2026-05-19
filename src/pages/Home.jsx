import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { selectAuthUser } from '@/features/auth';
import {
  PostCard,
  PostCardSkeleton,
  useCategories,
  useHome,
  HomeTabs,
  HomeCategoryFilters,
  EmptyHomeState,
  RecommendedSidebar,
} from '@/features/posts';

// Home: primary post feed and discovery hub
const Home = () => {
  const { categories } = useCategories();
  const user = useSelector(selectAuthUser);

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
    recommendedAuthors,
    isAuthorsLoading,
    staffPicks,
    isStaffPicksLoading,
  } = useHome();

  const renderContent = () => {
    if (postsLoading && posts.length === 0) {
      return (
        <div className="page-section">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (postsError) {
      return (
        <div className="flex justify-center py-20">
          <Alert
            variant="destructive"
            className="border-destructive/20 bg-destructive/5 max-w-md rounded-2xl shadow-lg"
          >
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

    return (
      <div className="page-section animate-in fade-in duration-700">
        {posts.map((post) => (
          <PostCard key={post.$id} post={post} />
        ))}

        {postsLoading && hasMore && (
          <div className="flex justify-center pt-10">
            <Loader2 className="text-primary/40 size-6 animate-spin" />
          </div>
        )}
      </div>
    );
  };

  return (
    <article className="section-grid animate-in fade-in duration-700">
      <section className="main-content">
        <HomeTabs
          activeMode={feedMode}
          onModeChange={handleFeedModeChange}
          isAuthenticated={!!authUserId}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        <HomeCategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="pb-20">{renderContent()}</div>
      </section>

      <aside className="right-sidebar">
        <div className="sticky top-[calc(var(--header-height,4rem)+2.5rem)]">
          <RecommendedSidebar
            authors={recommendedAuthors}
            isLoading={isAuthorsLoading}
            staffPicks={staffPicks}
            isStaffPicksLoading={isStaffPicksLoading}
            isAuthenticated={!!user}
          />
        </div>
      </aside>
    </article>
  );
};

export default Home;
