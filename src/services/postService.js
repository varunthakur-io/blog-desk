import { toast } from 'react-hot-toast';
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
        appwrite.collectionId,
        'unique()',
        postData,
      );

      toast.success('Post created successfully!');
      return res;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post.');
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
        appwrite.collectionId,
        postId,
        postData,
      );

      toast.success('Post updated successfully!');
      return res;
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'Failed to update post.');
      throw error;
    }
  }

  // Get a single post by its ID
  async getPostById(postId) {
    try {
      const res = await databases.getDocument(
        appwrite.databaseId,
        appwrite.collectionId,
        postId,
      );
      return res;
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error(error.message || 'Failed to fetch post.');
      throw error;
    }
  }

  // Get all posts
  async getAllPosts(page = 1, limit = 6) {
    try {
      // fetch all documents (no queries)
      const res = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.collectionId,
      );

      // client-side pagination
      const allDocs = res?.documents ?? [];
      const start = (page - 1) * limit;
      const pageDocs = allDocs.slice(start, start + limit);

      return pageDocs;
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error(error?.message || 'Failed to fetch posts.');
      throw error;
    }
  }

  // Delete a post by ID
  async deletePost(postId) {
    try {
      await databases.deleteDocument(
        appwrite.databaseId,
        appwrite.collectionId,
        postId,
      );
      toast.success('Post deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.message || 'Failed to delete post.');
      throw error;
    }
  }

  // Update likes count
  async updateLikes(postId, value) {
    try {
      // 1. Get the current document
      const doc = await databases.getDocument(
        appwrite.databaseId,
        appwrite.collectionId,
        postId,
      );

      // 2. Compute new likes
      const current = doc.likesCount ?? 0;
      // const next = current + value;
      const next = Math.max(0, current + value); // NEVER below 0

      // 3. Update the document
      await databases.updateDocument(
        appwrite.databaseId,
        appwrite.collectionId,
        postId,
        { likesCount: next },
      );
    } catch (error) {
      console.error('Like update failed:', error);
      toast.error('Failed to update like');
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
}

// Export a single shared instance
export const postService = new PostService();
