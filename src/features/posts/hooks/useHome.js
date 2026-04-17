import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { postService } from '@/features/posts';
import { debounce } from '@/lib/utils';
import {
  selectAllPosts,
  selectIsPostsLoading,
  selectPostsError,
  selectHasMore,
  selectPage,
  selectActiveCategory,
  selectFeedMode,
  setPostsStatus,
  setPostsError,
  setPostList,
  appendPostPage,
  setPostPagination,
  setActiveCategory,
  setFeedMode,
} from '@/features/posts';
import { selectAuthUserId } from '@/features/auth';
import { POSTS_PER_PAGE } from '@/constants';
import { getUniqueProfileIds, prefetchProfiles } from '@/features/profile/utils/prefetchProfiles';
import { profileService } from '@/features/profile';

const LIMIT = POSTS_PER_PAGE;

export const useHome = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const posts = useSelector(selectAllPosts);
  const isPostsLoading = useSelector(selectIsPostsLoading);
  const postsError = useSelector(selectPostsError);
  const hasMore = useSelector(selectHasMore);
  const page = useSelector(selectPage);
  const activeCategory = useSelector(selectActiveCategory);
  const feedMode = useSelector(selectFeedMode);
  const authUserId = useSelector(selectAuthUserId);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Sidebar States
  const [recommendedAuthors, setRecommendedAuthors] = useState([]);
  const [isAuthorsLoading, setIsAuthorsLoading] = useState(false);
  const [staffPicks, setStaffPicks] = useState([]);
  const [isStaffPicksLoading, setIsStaffPicksLoading] = useState(false);

  const loadingRef = useRef(false);

  // Sync feedMode with URL query param
  useEffect(() => {
    const feed = searchParams.get('feed');
    if (feed === 'following') {
      if (feedMode !== 'following') dispatch(setFeedMode('following'));
    } else {
      // Default to explore if not specified or 'explore'
      if (feedMode !== 'explore' && !feed) {
         // only reset if there is no query param at all
      } else if (feed === 'explore' && feedMode !== 'explore') {
         dispatch(setFeedMode('explore'));
      }
    }
  }, [searchParams, feedMode, dispatch]);

  // Sidebar: Fetch Recommended Authors
  useEffect(() => {
    const fetchAuthors = async () => {
      setIsAuthorsLoading(true);
      try {
        const authors = await profileService.searchProfiles(' '); 
        setRecommendedAuthors(authors.filter(a => a.$id !== authUserId));
      } catch (err) {
        console.error('useHome :: fetchAuthors failed', err);
      } finally {
        setIsAuthorsLoading(false);
      }
    };
    fetchAuthors();
  }, [authUserId]);

  // Sidebar: Fetch Staff Picks
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
              name: authorProfile?.name || post.authorName || 'Anonymous',
              username: authorProfile?.username || post.authorId
            }
          };
        });
        
        setStaffPicks(enrichedPosts);
      } catch (err) {
        console.error('useHome :: fetchStaffPicks failed', err);
      } finally {
        setIsStaffPicksLoading(false);
      }
    };
    fetchStaffPicks();
  }, []);

  // 1. Debounce logic for search input
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDebouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 500),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateDebouncedSearch(value);
  };

  const loadPage = useCallback(
    async (pageNum, category, search, mode) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      dispatch(setPostsStatus('loading'));
      try {
        let response;

        if (mode === 'following' && authUserId) {
          response = await postService.getFollowingFeed(authUserId, pageNum, LIMIT);
        } else {
          response = await postService.getAllPosts(pageNum, LIMIT, category, search);
        }

        const pagePosts = response.documents ?? [];

        const authorIds = getUniqueProfileIds(pagePosts, (post) => post.authorId);
        prefetchProfiles(dispatch, authorIds, 'Home feed profile prefetch');

        const totalFetched = (pageNum === 1 ? 0 : (pageNum - 1) * LIMIT) + pagePosts.length;

        if (pageNum === 1) {
          dispatch(setPostList(pagePosts));
        } else {
          dispatch(appendPostPage(pagePosts));
        }
        dispatch(setPostPagination({ page: pageNum, hasMore: totalFetched < response.total }));
      } catch (error) {
        dispatch(setPostsError(error?.message ?? 'Failed to fetch posts'));
      } finally {
        loadingRef.current = false;
      }
    },
    [dispatch, authUserId],
  );

  // 2. Reload when category, search, or feed mode changes
  useEffect(() => {
    loadPage(1, activeCategory, debouncedSearchTerm, feedMode);
  }, [activeCategory, debouncedSearchTerm, feedMode, loadPage]);

  // 3. Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      const { innerHeight } = window;
      const { scrollTop, offsetHeight } = document.documentElement;

      if (innerHeight + scrollTop >= offsetHeight - 200) {
        loadPage(page + 1, activeCategory, debouncedSearchTerm, feedMode);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, loadPage, debouncedSearchTerm, activeCategory, feedMode]);

  const handleCategoryChange = useCallback(
    (category) => {
      const next = category === activeCategory ? null : category;
      setSearchTerm('');
      setDebouncedSearchTerm('');
      dispatch(setActiveCategory(next));
    },
    [dispatch, activeCategory],
  );

  const handleFeedModeChange = useCallback(
    (mode) => {
      setSearchTerm('');
      setDebouncedSearchTerm('');
      setSearchParams({ feed: mode });
      dispatch(setFeedMode(mode));
    },
    [dispatch, setSearchParams],
  );

  return {
    posts,
    postsLoading: isPostsLoading,
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
    LIMIT,
  };
};
