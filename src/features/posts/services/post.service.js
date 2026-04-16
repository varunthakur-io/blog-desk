import { postApi } from './post.api';
import { storageService } from './storage.service';
import { commentService } from '@/features/comments';
import { likeService } from '@/features/likes';
import { authService } from '@/features/auth';
import { followService } from '@/features/follows';
import { Query } from 'appwrite';
import { notificationService } from '../../notifications/services/notification.service';
import { parseApiError } from '@/lib/error-handler';

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

class PostService {
  async createPost({ title, content, status, coverImageId, coverImageUrl, category }) {
    try {
      const user = await authService.getAccount();
      const postData = {
        authorId: user.$id,
        title,
        content,
        slug: generateSlug(title),
        status: status || 'draft',
        coverImageId: coverImageId || null,
        coverImageUrl: coverImageUrl || null,
        category: category || null,
        likesCount: 0,
        commentsCount: 0,
      };
      return await postApi.createPost(postData);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async updatePost(postId, updates) {
    try {
      const postData = { ...updates };
      if (postData.title) {
        postData.slug = generateSlug(postData.title);
      }
      // Allow explicit null to clear the category
      if (!('category' in postData)) {
        postData.category = postData.category || null;
      }
      return await postApi.updatePost(postId, postData);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async getPostById(postId) {
    try {
      return await postApi.getPostById(postId);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  // category: string | null — when provided, filters server-side via Query.equal
  async getAllPosts(page = 1, skip = 6, category = null, searchQuery = '') {
    try {
      const offset = (page - 1) * skip;

      const baseQueries = [
        Query.limit(skip),
        Query.offset(offset),
        Query.equal('status', 'published'),
        Query.orderDesc('$createdAt'),
      ];

      if (category) {
        baseQueries.push(Query.equal('category', category));
      }

      if (searchQuery) {
        baseQueries.push(
          Query.or([Query.search('title', searchQuery), Query.search('content', searchQuery)]),
        );
      }

      return await postApi.listPosts(baseQueries);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async getFollowingFeed(userId, page = 1, skip = 6) {
    try {
      if (!userId) throw new Error('getFollowingFeed: "userId" is required');

      // 1. Get the list of people this user follows
      const following = await followService.getFollowing(userId);
      const followingIds = following.map((f) => f.followingId);

      // 2. Handle empty following list
      if (followingIds.length === 0) {
        return { documents: [], total: 0 };
      }

      // 3. Fetch posts from those authors
      const offset = (page - 1) * skip;
      const queries = [
        Query.limit(skip),
        Query.offset(offset),
        Query.equal('status', 'published'),
        Query.equal('authorId', followingIds),
        Query.orderDesc('$createdAt'),
      ];

      return await postApi.listPosts(queries);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async getPostsByUserId(
    userId,
    page = 1,
    limit = 10,
    searchQuery = '',
    status = 'all',
    sortBy = 'newest',
  ) {
    try {
      if (!userId) throw new Error('getPostsByUserId: "userId" is required');

      const offset = (page - 1) * limit;
      const queries = [Query.equal('authorId', userId), Query.limit(limit), Query.offset(offset)];

      if (status === 'published') queries.push(Query.equal('status', 'published'));
      else if (status === 'draft') queries.push(Query.equal('status', 'draft'));

      if (sortBy === 'likes') queries.push(Query.orderDesc('likesCount'));
      else if (sortBy === 'oldest') queries.push(Query.orderAsc('$createdAt'));
      else queries.push(Query.orderDesc('$createdAt'));

      if (searchQuery) queries.push(Query.search('title', searchQuery));

      return await postApi.listPosts(queries);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async clearPostById(postId) {
    try {
      if (!postId) throw new Error('clearPostById: "postId" is required');
      await likeService.deleteLikesByPostId(postId);
      await commentService.deleteCommentsByPostId(postId);
      await notificationService.deleteNotificationsByPostId(postId);
      await postApi.clearPost(postId);
      return true;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async uploadPostImage(file, oldFileId) {
    try {
      const { fileId, fileUrl } = await storageService.uploadFileWithReplacement(file, oldFileId);
      return { fileId, imageUrl: fileUrl };
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  /**
   * Fetches unique categories from published posts.
   */
  async getUsedCategories() {
    try {
      const queries = [
        Query.equal('status', 'published'),
        Query.limit(100),
        Query.select(['category'])
      ];

      const res = await postApi.listPosts(queries);
      const categories = [...new Set(res.documents.map(p => p.category).filter(Boolean))];
      return categories.sort();
    } catch (error) {
      console.warn('PostService :: getUsedCategories failed:', error);
      return [];
    }
  }

  async getStaffPicks(limit = 3) {
    try {
      // First try to get most liked posts
      let res = await postApi.listPosts([
        Query.equal('status', 'published'),
        Query.limit(limit),
        Query.orderDesc('likesCount'),
      ]);

      // If no posts have likes (total is 0 or all counts are 0), just get latest
      if (res.total === 0 || (res.documents.length > 0 && res.documents[0].likesCount === 0)) {
        res = await postApi.listPosts([
          Query.equal('status', 'published'),
          Query.limit(limit),
          Query.orderDesc('$createdAt'),
        ]);
      }
      
      return res;
    } catch (error) {
      console.warn('PostService :: getStaffPicks failed:', error);
      return { documents: [] };
    }
  }
}

export const postService = new PostService();
