import { databases, appwriteConfig as appwrite } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

class LikeApi {
  async getLike(postId, userId) {
    const likeList = await databases.listDocuments(appwrite.databaseId, appwrite.likesCollectionId, [
      Query.equal('postId', postId),
      Query.equal('userId', userId),
      Query.limit(1),
    ]);
    return likeList.total > 0 ? likeList.documents[0] : null;
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
    return await databases.deleteDocument(appwrite.databaseId, appwrite.likesCollectionId, likeId);
  }

  async listLikesByUser(userId) {
    return await databases.listDocuments(appwrite.databaseId, appwrite.likesCollectionId, [
      Query.equal('userId', userId),
    ]);
  }

  async listLikesByPost(postId) {
    return await databases.listDocuments(appwrite.databaseId, appwrite.likesCollectionId, [
      Query.equal('postId', postId),
    ]);
  }
}

export const likeApi = new LikeApi();
