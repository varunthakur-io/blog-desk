import { databases } from '@/api/client';
import { Query, ID } from 'appwrite';
import { appwriteConfig as appwrite } from '@/config/appwrite';

class LikeApi {
  async getLike(postId, userId) {
    const res = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.likesCollectionId,
      [Query.equal('postId', postId), Query.equal('userId', userId), Query.limit(1)],
    );
    return res.total > 0 ? res.documents[0] : null;
  }

  async createLike(postId, userId) {
    return await databases.createDocument(
      appwrite.databaseId,
      appwrite.likesCollectionId,
      ID.unique(),
      { postId, userId },
    );
  }

  async deleteLike(likeId) {
    return await databases.deleteDocument(
      appwrite.databaseId,
      appwrite.likesCollectionId,
      likeId,
    );
  }

  async listLikesByUser(userId) {
    return await databases.listDocuments(
      appwrite.databaseId,
      appwrite.likesCollectionId,
      [Query.equal('userId', userId)],
    );
  }

  async listLikesByPost(postId) {
    return await databases.listDocuments(
      appwrite.databaseId,
      appwrite.likesCollectionId,
      [Query.equal('postId', postId)],
    );
  }
}

export const likeApi = new LikeApi();
