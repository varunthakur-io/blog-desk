import { postApi } from './post.api';
import { storageService } from '../storage';
import { commentService } from '../comments';
import { likeService } from '../likes';
import { authService } from '../auth';
import { Query } from 'appwrite';

class PostService {
  async createPost({ title, content, category, published, postImageURL }) {
    const user = await authService.getAccount();
    const postData = {
      authorId: user.$id,
      title,
      content,
      category: category || 'Uncategorized',
      likesCount: 0,
      published: published ?? true,
      postImageURL,
    };

    return await postApi.createPost(postData);
  }

  async updatePost(postId, { title, content, category, published, postImageURL }) {
    const postData = {
      title,
      content,
      category: category || 'Uncategorized',
      published: published ?? true,
      postImageURL,
    };
    return await postApi.updatePost(postId, postData);
  }

  async getPostById(postId) {
    return await postApi.getPostById(postId);
  }

  async getAllPosts(page = 1, skip = 6, category = null) {
    const offset = (page - 1) * skip;
    const limit = skip;
    const queries = [Query.limit(limit), Query.offset(offset), Query.equal('published', true)];

    if (category) {
      queries.push(Query.equal('category', category));
    }

    return await postApi.listPosts(queries);
  }

  async getPostsByUserId(userId, page = 1, limit = 10, searchQuery = '', status = 'all', sortBy = 'newest') {
    if (!userId) throw new Error('getPostsByUserId: "userId" is required');

    const offset = (page - 1) * limit;
    const queries = [Query.equal('authorId', userId), Query.limit(limit), Query.offset(offset)];

    if (status === 'published') queries.push(Query.equal('published', true));
    else if (status === 'draft') queries.push(Query.equal('published', false));

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
