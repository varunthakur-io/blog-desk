import { databases, appwriteConfig as appwrite } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

class CommentApi {
  async createComment(postId, userId, content, authorName) {
    return await databases.createDocument(
      appwrite.databaseId,
      appwrite.commentsCollectionId,
      ID.unique(),
      { 
        postId, 
        userId, 
        content,
        authorName: authorName || 'Anonymous' // Saving the name in the doc
      },
    );
  }

  async listCommentsByPost(postId) {
    return await databases.listDocuments(
      appwrite.databaseId,
      appwrite.commentsCollectionId,
      [Query.equal('postId', postId), Query.orderDesc('$createdAt'), Query.limit(50)],
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
