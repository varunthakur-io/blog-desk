import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { profileService } from '@/features/profile';
import { selectAuthUser } from '@/features/auth';
import { 
  PostCard, 
  PostCardSkeleton, 
  useCategories, 
  postService,
  useHome,
  HomeTabs, 
  HomeCategoryFilters, 
  EmptyHomeState, 
  RecommendedSidebar 
} from '@/features/posts';

/**
 * Home page displaying the primary post feed and recommendations.
 */
const Home = () => {
  const { categories } = useCategories();
  const [recommendedAuthors, setRecommendedAuthors] = useState([]);
  const [isAuthorsLoading, setIsAuthorsLoading] = useState(false);
  const [staffPicks, setStaffPicks] = useState([]);
  const [isStaffPicksLoading, setIsStaffPicksLoading] = useState(false);

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

  const user = useSelector(selectAuthUser);
  const isEmailVerified = user?.emailVerification;

  useEffect(() => {
    const fetchAuthors = async () => {
      setIsAuthorsLoading(true);
      try {
        const authors = await profileService.searchProfiles(' '); 
        setRecommendedAuthors(authors.filter(a => a.$id !== authUserId));
      } catch (err) {
        console.error(err);
      } finally {
        setIsAuthorsLoading(false);
      }
    };
    fetchAuthors();
  }, [authUserId]);

  useEffect(() => {
    const fetchStaffPicks = async () => {
      setIsStaffPicksLoading(true);
      try {
        const res = await postService.getStaffPicks(3);
        const posts = res.documents;
        const authorIds = [...new Set(posts.map(p => p.authorId))];
        const profiles = await profileService.getProfilesByIds(authorIds);
        
        const enrichedPosts = posts.map(post => {
          const authorProfile = profiles.find(p => p.userId === post.authorId);
          return {
            ...post,
            author: {
              ...authorProfile,
              name: authorProfile?.name || post.authorName || 'Member',
              username: authorProfile?.username || post.authorId
            }
          };
        });
        
        setStaffPicks(enrichedPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setIsStaffPicksLoading(false);
      }
    };
    fetchStaffPicks();
  }, []);

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
          <Alert variant="destructive" className="max-w-md rounded-2xl border-destructive/20 bg-destructive/5 shadow-lg">
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
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.$id} post={post} />
          ))}
        </div>

        {postsLoading && hasMore && (
          <div className="flex justify-center pt-10">
            <Loader2 className="size-6 animate-spin text-primary/40" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-0 xl:flex-row">
      {/* ── Main Feed Column ── */}
      <section className="min-w-0 flex-1 max-w-4xl xl:pr-16">
        
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

        <div className="pb-20">
          {renderContent()}
        </div>
      </section>

      {/* ── Right Sidebar ── */}
      <aside className="hidden xl:block shrink-0 xl:w-[350px] border-l border-border/40">
        <div className="sticky top-24 pl-12 transition-all duration-300">
          <RecommendedSidebar 
            authors={recommendedAuthors} 
            isLoading={isAuthorsLoading}
            staffPicks={staffPicks}
            isStaffPicksLoading={isStaffPicksLoading}
            isEmailVerified={isEmailVerified}
          />
        </div>
      </aside>
    </div>
  );
};

export default Home;
