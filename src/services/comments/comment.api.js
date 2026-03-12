import { databases } from '@/api/client';
import { Query, ID } from 'appwrite';
import { appwriteConfig as appwrite } from '@/config/appwrite';

class CommentApi {
  async createComment(postId, userId, content) {
    return await databases.createDocument(
      appwrite.databaseId,
      appwrite.commentsCollectionId,
      ID.unique(),
      { postId, userId, content },
    );
  }

  async listCommentsByPost(postId) {
    return await databases.listDocuments(
      appwrite.databaseId,
      appwrite.commentsCollectionId,
      [Query.equal('postId', postId), Query.orderDesc('$createdAt'), Query.limit(10)],
    );
  }

  async deleteComment(commentId) {
    return await databases.deleteDocument(
      appwrite.databaseId,
      appwrite.commentsCollectionId,
      commentId,
    );
  }
}

export const commentApi = new CommentApi();
