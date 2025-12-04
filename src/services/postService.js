import { ID, Query } from 'appwrite';
import { account, databases } from '@/api/client';
import { appwriteConfig as appwrite } from '../config/appwrite';

// Simple in-memory cache: key = `${userId}:${postId}` → boolean
const likedCache = new Map();

class PostService {
  // Create a new blog post
  async createPost({ title, content }) {
    try {
      const user = await account.get();

      // post data
      const postData = {
        authorId: user.$id,
        authorName: user.name,
        title,
        content,
        likesCount: 0,
      };

      // create post document
      const res = await databases.createDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        'unique()',
        postData,
      );

      return res;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Update an existing blog post
  async updatePost(postId, { title, content }) {
    try {
      const postData = {
        title,
        content,
      };

      const res = await databases.updateDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
        postData,
      );

      return res;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Get a single post by its ID
  async getPostById(postId) {
    try {
      const res = await databases.getDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
      );
      return res;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  // Get all posts
  async getAllPosts(page = 1, skip = 6) {
    try {
      const offset = (page - 1) * skip;
      const limit = skip;

      const res = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        [Query.limit(limit), Query.offset(offset)],
      );

      return res;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  // Get posts created by a specific user
  async getPostsByUser(userId) {
    try {
      const res = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        [Query.equal('authorId', userId), Query.orderDesc('$createdAt')],
      );
      return res.documents;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  }

  // Delete a post by ID
  async deletePost(postId) {
    try {
      await databases.deleteDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
      );
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Update likes count
  async updateLikes(postId, value) {
    try {
      // 1. Get the current document
      const doc = await databases.getDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
      );

      // 2. Compute new likes
      const current = doc.likesCount ?? 0;
      // const next = current + value;
      const next = Math.max(0, current + value); // NEVER below 0

      // 3. Update the document
      await databases.updateDocument(
        appwrite.databaseId,
        appwrite.postsCollectionId,
        postId,
        { likesCount: next },
      );
    } catch (error) {
      console.error('Like update failed:', error);
      throw error; // so UI can rollback
    }
  }

  // check if user has liked a post (cached)
  async hasUserLiked(postId, userId) {
    const key = `${userId}:${postId}`;

    // 1) Return from cache if present
    if (likedCache.has(key)) {
      return likedCache.get(key); // boolean true/false
    }

    // 2) Otherwise hit the API once
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
  }

  // user liked a post
  async likePost(postId, userId) {
    const key = `${userId}:${postId}`;

    // avoid duplicates
    const existing = await this.hasUserLiked(postId, userId);
    if (existing) return;

    // create like document
    await databases.createDocument(
      appwrite.databaseId,
      appwrite.likesCollectionId,
      ID.unique(),
      {
        postId,
        userId,
      },
    );

    // increment likes count on post
    await this.updateLikes(postId, +1);

    // update cache
    likedCache.set(key, true);
  }

  // user unliked a post
  async unlikePost(postId, userId) {
    const key = `${userId}:${postId}`;

    const res = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.likesCollectionId,
      [
        Query.equal('postId', postId),
        Query.equal('userId', userId),
        Query.limit(1),
      ],
    );

    if (res.total === 0) return;

    // delete like document
    if (res.total > 0) {
      const likeDocId = res.documents[0].$id;
      await databases.deleteDocument(
        appwrite.databaseId,
        appwrite.likesCollectionId,
        likeDocId,
      );
    }

    // decrement likes count on post
    await this.updateLikes(postId, -1);

    // update cache
    likedCache.set(key, false);
  }

  // get all posts liked by a user
  async getLikedPostsByUser(userId) {
    // 1) Fetch like documents for userId from likesCollection
    const likesRes = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.likesCollectionId,
      [Query.equal('userId', userId)],
    );

    const likeDocs = likesRes.documents || [];
    const postIds = likeDocs.map((doc) => doc.postId).filter(Boolean);

    if (postIds.length === 0) {
      return [];
    }

    // 2. Fetch posts by those IDs
    const postsRes = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      [Query.equal('$id', postIds), Query.orderDesc('$createdAt')],
    );

    return postsRes.documents || [];
  }

  //  Add a comment to a post
  async addComment({ postId, userId, authorName, content }) {
    try {
      const res = await databases.createDocument(
        appwrite.databaseId,
        appwrite.commentsCollectionId,
        ID.unique(),
        {
          postId,
          userId,
          authorName,
          content,
        },
      );
      return res;
    } catch (err) {
      console.error('Error adding comment:', err.message);
    }
  }

  // Get comments for a post
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
    } catch (err) {
      console.error('Failed to load comments', err.message);
      return [];
    }
  }
}

// Export a single shared instance
export const postService = new PostService();
