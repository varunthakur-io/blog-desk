import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PostCard, PostCardSkeleton, useCategories, postService } from '@/features/posts';
import { useHome } from '@/features/posts';
import { profileService } from '@/features/profile';
import { selectAuthUser } from '@/features/auth';
import { 
  HomeHeader, 
  HomeTabs, 
  HomeCategoryFilters, 
  EmptyHomeState, 
  RecommendedSidebar 
} from './HomeUI';

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

  // Fetch some interesting authors for the sidebar
  useEffect(() => {
    const fetchAuthors = async () => {
      setIsAuthorsLoading(true);
      try {
        // Just fetch some recent profiles as a placeholder for recommendations
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

  // Fetch staff picks
  useEffect(() => {
    const fetchStaffPicks = async () => {
      setIsStaffPicksLoading(true);
      try {
        const res = await postService.getStaffPicks(3);
        const posts = res.documents;
        
        // Fetch profiles for these authors
        const authorIds = [...new Set(posts.map(p => p.authorId))];
        const profiles = await profileService.getProfilesByIds(authorIds);
        
        // Map profiles back to posts
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
        <div className="space-y-10 animate-in fade-in duration-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
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

    return (
      <div className="space-y-2 animate-in fade-in duration-700">
        <div className="flex flex-col">
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
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-0">
      {/* ── Main Feed Column ── */}
      <div className="flex-1 min-w-0 max-w-4xl xl:pr-16">
        <HomeHeader searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        
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

        <main className="pb-20 mt-4">
          {renderContent()}
        </main>
      </div>

      {/* ── Right Sidebar ── */}
      <RecommendedSidebar 
        authors={recommendedAuthors} 
        isLoading={isAuthorsLoading}
        staffPicks={staffPicks}
        isStaffPicksLoading={isStaffPicksLoading}
        isEmailVerified={isEmailVerified}
      />
    </div>
  );
};

export default Home;
