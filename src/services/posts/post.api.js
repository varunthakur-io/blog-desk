import { databases, appwriteConfig as appwrite } from '@/lib/appwrite';

class PostApi {
  async createPost(postData) {
    return await databases.createDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      'unique()',
      postData,
    );
  }

  async updatePost(postId, postData) {
    return await databases.updateDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      postId,
      postData,
    );
  }

  async getPostById(postId) {
    return await databases.getDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      postId,
    );
  }

  async listPosts(queries) {
    return await databases.listDocuments(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      queries,
    );
  }

  async deletePost(postId) {
    return await databases.deleteDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      postId,
    );
  }
}

export const postApi = new PostApi();
