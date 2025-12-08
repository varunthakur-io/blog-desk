import { ID, Query } from 'appwrite';
import { account, databases } from '@/api/client';
import { appwriteConfig as appwrite } from '../config/appwrite';

/**
 * Simple in-memory cache for likes
 * Key: `${userId}:${postId}`
 * Value: boolean
 */
const likedCache = new Map();

class PostService {
  // ==========================================
  //                 POSTS
  // ==========================================

  /**
   * Create a new blog post
   * @param {Object} params - Post parameters
   * @param {string} params.title
   * @param {string} params.content
   * @param {string} params.category
   * @param {boolean} params.published
   * @returns {Promise<Object>} The created post document
   */
  async createPost({ title, content, category, published }) {
    try {
      const user = await account.get();
      const postData = {
        authorId: user.$id,
        title,
        content,
        category: category || 'Uncategorized', // Default if not provided
        likesCount: 0,
        published: published ?? true, // Default to true if not provided
      };

      return await databases.createDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        'unique()',
        postData,
      );
    } catch (error) {
      console.error('PostService :: createPost()', error);
      throw error;
    }
  }

  /**
   * Update an existing blog post
   * @param {string} postId - ID of the post to update
   * @param {Object} params - Parameters for updating the post
   * @param {string} params.title
   * @param {string} params.content
   * @param {string} params.category
   * @param {boolean} [params.published] - Optional published status (default: true)
   * @returns {Promise<Object>} The updated post document
   */
  async updatePost(postId, { title, content, category, published }) {
    try {
      const postData = {
        title,
        content,
        category: category || 'Uncategorized', // Ensure category is updated
        published: published ?? true, // Default to true if not provided
      };
      return await databases.updateDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
        postData,
      );
    } catch (error) {
      console.error('PostService :: updatePost()', error);
      throw error;
    }
  }

  /**
   * Get a single post by its ID
   * @param {string} postId
   * @returns {Promise<Object>} The post document
   */
  async getPostById(postId) {
    try {
      return await databases.getDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
      );
    } catch (error) {
      console.error('PostService :: getPostById()', error);
      throw error;
    }
  }

  /**
   * Get all posts with pagination, optionally filtered by category
   * @param {number} page - Page number (1-based)
   * @param {number} skip - Number of items to return
   * @param {string} [category] - Optional category to filter posts by
   * @returns {Promise<{ total: number, documents: Object[] }>} List of post documents with total count
   */
  async getAllPosts(page = 1, skip = 6, category = null) {
    try {
      const offset = (page - 1) * skip;
      const limit = skip;
      const queries = [Query.limit(limit), Query.offset(offset)];

      if (category) {
        queries.push(Query.equal('category', category));
      }

      return await databases.listDocuments(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        queries,
      );
    } catch (error) {
      console.error('PostService :: getAllPosts()', error);
      throw error;
    }
  }

  /**
   * Get posts created by a specific user
   * @param {string} userId - The user's ID
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @param {string} [searchQuery] - Optional search query
   * @returns {Promise<{ total: number, documents: Object[] }>} List of documents
   */
  async getPostsByUserId(userId, page = 1, limit = 10, searchQuery = '') {
    if (!userId) {
      throw new Error('getPostsByUserId: "userId" is required');
    }

    try {
      const offset = (page - 1) * limit;
      const queries = [
        Query.equal('authorId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset),
      ];

      if (searchQuery) {
        queries.push(Query.search('title', searchQuery));
      }

      return await databases.listDocuments(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        queries,
      );
    } catch (error) {
      console.error('PostService :: getPostsByUserId()', error);
      throw error;
    }
  }

  /**
   * Delete a post and all its likes by post ID
   * @param {string} postId - ID of the post to delete
   * @returns {Promise<boolean>} True if deletion succeeds
   */
  async deletePostById(postId) {
    if (!postId) {
      throw new Error('deletePostById: "postId" is required');
    }

    try {
      // 1. Delete all likes for this post
      await this.deleteLikesByPostId(postId);

      // 2. Delete all comments for this post
      await this.deleteCommentsByPostId(postId);

      // 3. Delete the post itself
      await databases.deleteDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
      );

      return true;
    } catch (error) {
      console.error('PostService :: deletePostById()', error);
      throw error;
    }
  }

  // ==========================================
  //                 LIKES
  // ==========================================

  /**
   * Check if user has liked a post (uses cache)
   * @param {string} postId
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async hasUserLiked(postId, userId) {
    const key = `${userId}:${postId}`;
    if (likedCache.has(key)) {
      return likedCache.get(key);
    }

    try {
      const res = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.likesCollectionId,
        [
          Query.equal('postId', postId),
          Query.equal('userId', userId),
          Query.limit(1),
        ],
      );

      const liked = res.total > 0;
      likedCache.set(key, liked);
      return liked;
    } catch (error) {
      console.error('PostService :: hasUserLiked()', error);
      return false;
    }
  }

  /**
   * Toggle like status: Like a post
   * @param {string} postId
   * @param {string} userId
   */
  async likePost(postId, userId) {
    const key = `${userId}:${postId}`;

    try {
      const existing = await this.hasUserLiked(postId, userId);
      if (existing) return;

      await databases.createDocument(
        appwrite.databaseId,
        appwrite.likesCollectionId,
        ID.unique(),
        { postId, userId },
      );

      await this._updateLikesCount(postId, 1);
      likedCache.set(key, true);
    } catch (error) {
      console.error('PostService :: likePost()', error);
      throw error;
    }
  }

  /**
   * Toggle like status: Unlike a post
   * @param {string} postId
   * @param {string} userId
   */
  async unlikePost(postId, userId) {
    const key = `${userId}:${postId}`;

    try {
      const res = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.likesCollectionId,
        [
          Query.equal('postId', postId),
          Query.equal('userId', userId),
          Query.limit(1),
        ],
      );

      if (res.total > 0) {
        const likeDocId = res.documents[0].$id;
        await databases.deleteDocument(
          appwrite.databaseId,
          appwrite.likesCollectionId,
          likeDocId,
        );

        await this._updateLikesCount(postId, -1);
        likedCache.set(key, false);
      }
    } catch (error) {
      console.error('PostService :: unlikePost()', error);
      throw error;
    }
  }

  /**
   * Get all posts liked by a user
   * @param {string} userId
   * @returns {Promise<{ total: number, documents: Object[] }>} List of post documents with total count
   */
  async getLikedPostsByUserId(userId) {
    if (!userId) {
      throw new Error('getLikedPostsByUserId: "userId" is required');
    }
    try {
      const likesRes = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.likesCollectionId,
        [Query.equal('userId', userId)],
      );

      const likeDocs = likesRes.documents || [];
      const postIds = likeDocs.map((doc) => doc.postId).filter(Boolean);

      if (postIds.length === 0) return [];

      const postsRes = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        [Query.equal('$id', postIds), Query.orderDesc('$createdAt')],
      );

      return postsRes || [];
    } catch (error) {
      console.error('PostService :: getLikedPostsByUser()', error);
      throw error;
    }
  }

  /**
   * Internal helper to update likes count on a post
   * @param {string} postId
   * @param {number} increment - Value to add (can be negative)
   * @private
   */
  async _updateLikesCount(postId, increment) {
    try {
      const doc = await databases.getDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
      );

      const current = doc.likesCount ?? 0;
      const next = Math.max(0, current + increment);

      await databases.updateDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
        { likesCount: next },
      );
    } catch (error) {
      console.error('PostService :: _updateLikesCount()', error);
      throw error;
    }
  }

  /**
   * Delete all likes for a given post
   * @param {string} postId - ID of the post
   * @returns {Promise<void>}
   */
  async deleteLikesByPostId(postId) {
    if (!postId) {
      throw new Error('deleteLikesByPostId: "postId" is required');
    }

    try {
      // 1. Find likes belonging to this post
      const likesList = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.likesCollectionId,
        [Query.equal('postId', postId)],
      );

      // 2. Delete each like document
      const deletePromises = likesList.documents.map((like) =>
        databases.deleteDocument(
          appwrite.databaseId,
          appwrite.likesCollectionId,
          like.$id,
        ),
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('PostService :: deleteLikesByPostId()', error);
      throw error;
    }
  }

  // ==========================================
  //                 COMMENTS
  // ==========================================

  /**
   * Add a comment to a post
   * @param {Object} params
   * @param {string} params.postId
   * @param {string} params.userId
   * @param {string} params.content
   * @returns {Promise<Object>} The created comment document
   */
  async addComment({ postId, userId, content }) {
    try {
      return await databases.createDocument(
        appwrite.databaseId,
        appwrite.commentsCollectionId,
        ID.unique(),
        { postId, userId, content },
      );
    } catch (error) {
      console.error('PostService :: addComment()', error);
      throw error;
    }
  }

  /**
   * Get comments for a post
   * @param {string} postId
   * @returns {Promise<Array>} List of comment documents
   */
  async getCommentsByPost(postId) {
    try {
      const res = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.commentsCollectionId,
        [
          Query.equal('postId', postId),
          Query.orderDesc('$createdAt'),
          Query.limit(10),
        ],
      );
      return res.documents;
    } catch (error) {
      console.error('PostService :: getCommentsByPost()', error);
      return []; // Return empty array so UI doesn't break
    }
  }

  /**
   * Delete a comment by its ID
   * @param {string} postId - ID of the post
   * @returns {Promise<null>}
   */
  async deleteCommentsByPostId(postId) {
    if (!postId) {
      throw new Error('deleteCommentsByPostId: "postId" is required');
    }
    try {
      // 1. Find comments belonging to this post
      const commentsList = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.commentsCollectionId,
        [Query.equal('postId', postId)],
      );

      // 2. Delete each comment document
      const deletePromises = commentsList.documents.map((comment) =>
        databases.deleteDocument(
          appwrite.databaseId,
          appwrite.commentsCollectionId,
          comment.$id,
        ),
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('PostService :: deleteCommentsByPostId()', error);
      throw error;
    }
  }
}

export const postService = new PostService();
