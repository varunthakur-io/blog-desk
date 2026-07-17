import { useState, useEffect } from 'react';
import { profileService } from '@/features/profile';
import { postService } from '@/features/posts';

/**
 * Hook to manage home page sidebar recommendations (authors and staff picks).
 */
export const useHomeSidebar = (authUserId) => {
  const [recommendedAuthors, setRecommendedAuthors] = useState([]);
  const [isAuthorsLoading, setIsAuthorsLoading] = useState(false);
  const [staffPicks, setStaffPicks] = useState([]);
  const [isStaffPicksLoading, setIsStaffPicksLoading] = useState(false);

  // Sidebar: Fetch Recommended Authors
  useEffect(() => {
    const fetchAuthors = async () => {
      setIsAuthorsLoading(true);
      try {
        const authors = await profileService.getRecommendedProfiles(10);
        setRecommendedAuthors(authors.filter((a) => a.$id !== authUserId));
      } catch (err) {
        console.error('useHomeSidebar :: fetchAuthors failed', err);
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
        const authorIds = [...new Set(posts.map((p) => p.authorId))];
        const profiles = await profileService.getProfilesByIds(authorIds);

        const enrichedPosts = posts.map((post) => {
          const authorProfile = profiles.find((p) => p.$id === post.authorId);
          return {
            ...post,
            authorName: authorProfile?.name || post.authorName || 'Anonymous',
            authorAvatarUrl: authorProfile?.avatarUrl || null,
            authorUsername: authorProfile?.username || post.authorId,
          };
        });
        setStaffPicks(enrichedPosts);
      } catch (err) {
        console.error('useHomeSidebar :: fetchStaffPicks failed', err);
      } finally {
        setIsStaffPicksLoading(false);
      }
    };
    fetchStaffPicks();
  }, []);

  return {
    recommendedAuthors,
    isAuthorsLoading,
    staffPicks,
    isStaffPicksLoading,
  };
};
