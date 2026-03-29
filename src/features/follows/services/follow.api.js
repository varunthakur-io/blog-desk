import { databases, appwriteConfig as appwrite } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

class FollowApi {
  constructor() {
    this.collectionId = appwrite.followsCollectionId;
  }

  async followUser(followerId, followingId) {
    return await databases.createDocument(appwrite.databaseId, this.collectionId, ID.unique(), {
      followerId,
      followingId,
    });
  }

  async unfollowUser(followId) {
    return await databases.deleteDocument(appwrite.databaseId, this.collectionId, followId);
  }

  async getFollowRelationship(followerId, followingId) {
    const list = await databases.listDocuments(appwrite.databaseId, this.collectionId, [
      Query.equal('followerId', followerId),
      Query.equal('followingId', followingId),
      Query.limit(1),
    ]);
    return list.total > 0 ? list.documents[0] : null;
  }

  async getFollowers(userId) {
    return await databases.listDocuments(appwrite.databaseId, this.collectionId, [
      Query.equal('followingId', userId),
    ]);
  }

  async getFollowing(userId) {
    return await databases.listDocuments(appwrite.databaseId, this.collectionId, [
      Query.equal('followerId', userId),
    ]);
  }
}

export const followApi = new FollowApi();
