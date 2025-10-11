
import { Client, Account, ID, Databases } from 'appwrite';
import { toast } from 'react-hot-toast';
import { appwriteConfig as appwrite } from '../config/appwrite';

class PostService {
  constructor() {
    this.client = new Client()
      .setEndpoint(appwrite.url)
      .setProject(appwrite.projectId);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }

  // Create a new blog post
  async createPost({ title, content }) {
    try {
      const user = await this.account.get();
      const postId = ID.unique();

      const postData = {
        title,
        content,
        authorId: user.$id,
        authorName: user.name || user.email,
        createdAt: new Date().toISOString(),
      };

      const res = await this.databases.createDocument(
        appwrite.databaseId,
        appwrite.collectionId,
        postId,
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
        updatedAt: new Date().toISOString(),
      };

      const res = await this.databases.updateDocument(
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
      const res = await this.databases.getDocument(
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
  async getAllPosts() {
    try {
      const res = await this.databases.listDocuments(
        appwrite.databaseId,
        appwrite.collectionId,
      );
      return res.documents;
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error(error.message || 'Failed to fetch posts.');
      throw error;
    }
  }

  // Delete a post by ID
  async deletePost(postId) {
    try {
      await this.databases.deleteDocument(
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
}

// Export a single shared instance
export const postService = new PostService();

