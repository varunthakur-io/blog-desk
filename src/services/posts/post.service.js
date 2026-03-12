import { postApi } from './post.api';
import { storageService } from '../storage';
import { commentService } from '../comments';
import { likeService } from '../likes';
import { Query } from 'appwrite';
import { authService } from '../auth';

class PostService {
  async createPost({ title, content, category, published, postImageURL }) {
    try {
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
    } catch (error) {
      console.error('PostService :: createPost()', error);
      throw error;
    }
  }

  async updatePost(postId, { title, content, category, published, postImageURL }) {
    try {
      const postData = {
        title,
        content,
        category: category || 'Uncategorized',
        published: published ?? true,
        postImageURL,
      };
      return await postApi.updatePost(postId, postData);
    } catch (error) {
      console.error('PostService :: updatePost()', error);
      throw error;
    }
  }

  async getPostById(postId) {
    try {
      return await postApi.getPostById(postId);
    } catch (error) {
      console.error('PostService :: getPostById()', error);
      throw error;
    }
  }

  async getAllPosts(page = 1, skip = 6, category = null) {
    try {
      const offset = (page - 1) * skip;
      const limit = skip;
      const queries = [Query.limit(limit), Query.offset(offset), Query.equal('published', true)];

      if (category) {
        queries.push(Query.equal('category', category));
      }

      return await postApi.listPosts(queries);
    } catch (error) {
      console.error('PostService :: getAllPosts()', error);
      throw error;
    }
  }

  async getPostsByUserId(userId, page = 1, limit = 10, searchQuery = '', status = 'all', sortBy = 'newest') {
    if (!userId) throw new Error('getPostsByUserId: "userId" is required');

    try {
      const offset = (page - 1) * limit;
      const queries = [Query.equal('authorId', userId), Query.limit(limit), Query.offset(offset)];

      if (status === 'published') queries.push(Query.equal('published', true));
      else if (status === 'draft') queries.push(Query.equal('published', false));

      if (sortBy === 'likes') queries.push(Query.orderDesc('likesCount'));
      else if (sortBy === 'oldest') queries.push(Query.orderAsc('$createdAt'));
      else queries.push(Query.orderDesc('$createdAt'));

      if (searchQuery) queries.push(Query.search('title', searchQuery));

      return await postApi.listPosts(queries);
    } catch (error) {
      console.error('PostService :: getPostsByUserId()', error);
      throw error;
    }
  }

  async deletePostById(postId) {
    if (!postId) throw new Error('deletePostById: "postId" is required');

    try {
      await likeService.deleteLikesByPostId(postId);
      await commentService.deleteCommentsByPostId(postId);
      await postApi.deletePost(postId);
      return true;
    } catch (error) {
      console.error('PostService :: deletePostById()', error);
      throw error;
    }
  }

  async uploadPostImage(file, oldFileId) {
    try {
      const { fileId, fileUrl } = await storageService.uploadFileWithReplacement(file, oldFileId);
      return { fileId, imageUrl: fileUrl };
    } catch (err) {
      console.error('Error uploading post image:', err);
      throw err;
    }
  }
}

export const postService = new PostService();
