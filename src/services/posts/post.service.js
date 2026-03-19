import { postApi } from './post.api';
import { storageService } from '../storage';
import { commentService } from '../comments';
import { likeService } from '../likes';
import { authService } from '../auth';
import { Query } from 'appwrite';

/**
 * Utility to generate a URL-friendly slug from a title.
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

class PostService {
  // Seed author metadata and denormalized counters once so feeds/details can render without follow-up writes.
  async createPost({ title, content, status, coverImageId, coverImageUrl }) {
    const user = await authService.getAccount();
    const postData = {
      authorId: user.$id,
      title,
      content,
      slug: generateSlug(title),
      status: status || 'draft',
      coverImageId: coverImageId || null,
      coverImageUrl: coverImageUrl || null,
      likesCount: 0,
      commentsCount: 0,
    };

    // Seed denormalized counters once so list/detail screens can read them cheaply.
    return await postApi.createPost(postData);
  }

  async updatePost(postId, updates) {
    const postData = { ...updates };

    if (postData.title) {
      postData.slug = generateSlug(postData.title);
    }

    return await postApi.updatePost(postId, postData);
  }

  async getPostById(postId) {
    return await postApi.getPostById(postId);
  }

  async getAllPosts(page = 1, skip = 6) {
    const offset = (page - 1) * skip;
    const limit = skip;
    const queries = [Query.limit(limit), Query.offset(offset), Query.equal('status', 'published')];

    return await postApi.listPosts(queries);
  }

  // Build the profile/dashboard query from filters instead of maintaining separate list methods per view.
  async getPostsByUserId(
    userId,
    page = 1,
    limit = 10,
    searchQuery = '',
    status = 'all',
    sortBy = 'newest',
  ) {
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
  }

  // Remove dependent records first so the app never points at likes/comments for a missing post.
  async clearPostById(postId) {
    if (!postId) throw new Error('clearPostById: "postId" is required');

    // Remove dependent relations first so dashboards/details never point at a missing post.
    await likeService.deleteLikesByPostId(postId);
    await commentService.deleteCommentsByPostId(postId);
    await postApi.clearPost(postId);
    return true;
  }

  async uploadPostImage(file, oldFileId) {
    const { fileId, fileUrl } = await storageService.uploadFileWithReplacement(file, oldFileId);
    return { fileId, imageUrl: fileUrl };
  }
}

export const postService = new PostService();
