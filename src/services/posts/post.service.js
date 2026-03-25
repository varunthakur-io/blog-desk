import { postApi } from './post.api';
import { storageService } from '../storage';
import { commentService } from '../comments';
import { likeService } from '../likes';
import { authService } from '../auth';
import { Query } from 'appwrite';

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
  }

  async updatePost(postId, updates) {
    const postData = { ...updates };
    if (postData.title) {
      postData.slug = generateSlug(postData.title);
    }
    // Allow explicit null to clear the category
    if (!('category' in postData)) {
      postData.category = postData.category || null;
    }
    return await postApi.updatePost(postId, postData);
  }

  async getPostById(postId) {
    return await postApi.getPostById(postId);
  }

  // category: string | null — when provided, filters server-side via Query.equal
  async getAllPosts(page = 1, skip = 6, category = null, searchQuery = '') {
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
        Query.or([Query.contains('title', searchQuery), Query.contains('content', searchQuery)]),
      );
    }

    return await postApi.listPosts(baseQueries);
  }

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

  async clearPostById(postId) {
    if (!postId) throw new Error('clearPostById: "postId" is required');
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
