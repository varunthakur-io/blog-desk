import { databases, appwriteConfig as appwrite } from '@/lib/appwrite';
import { Query } from 'appwrite';

class ProfileApi {
  async getProfile(userId) {
    // Profiles deliberately reuse the auth user id as the document id.
    return await databases.getDocument(appwrite.databaseId, 'profiles', userId);
  }

  async getProfileByUsername(username) {
    const profileList = await databases.listDocuments(appwrite.databaseId, 'profiles', [
      Query.equal('username', username),
    ]);
    return profileList.total > 0 ? profileList.documents[0] : null;
  }

  async createProfile(userId, profileData) {
    return await databases.createDocument(appwrite.databaseId, 'profiles', userId, profileData);
  }

  async updateProfile(userId, profileData) {
    return await databases.updateDocument(appwrite.databaseId, 'profiles', userId, profileData);
  }

  async clearProfile(userId) {
    return await databases.deleteDocument(appwrite.databaseId, 'profiles', userId);
  }

  async checkUsernameAvailable(username) {
    const profileList = await databases.listDocuments(appwrite.databaseId, 'profiles', [
      Query.equal('username', username),
    ]);
    return profileList.total === 0;
  }

  async getProfilesByIds(userIds) {
    if (!userIds || userIds.length === 0) return { documents: [], total: 0 };
    return await databases.listDocuments(appwrite.databaseId, 'profiles', [
      Query.equal('$id', userIds),
      Query.limit(userIds.length),
    ]);
  }
}

export const profileApi = new ProfileApi();
