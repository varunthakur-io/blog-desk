import { databases, appwriteConfig as appwrite } from '@/lib/appwrite';
import { Query } from 'appwrite';

class ProfileApi {
  async getProfile(userId) {
    return await databases.getDocument(appwrite.databaseId, 'profiles', userId);
  }

  async getProfileByUsername(username) {
    const res = await databases.listDocuments(appwrite.databaseId, 'profiles', [
      Query.equal('username', username),
    ]);
    return res.total > 0 ? res.documents[0] : null;
  }

  async createProfile(userId, profileData) {
    return await databases.createDocument(
      appwrite.databaseId,
      'profiles',
      userId,
      profileData,
    );
  }

  async updateProfile(userId, profileData) {
    return await databases.updateDocument(
      appwrite.databaseId,
      'profiles',
      userId,
      profileData,
    );
  }

  async deleteProfile(userId) {
    return await databases.deleteDocument(
      appwrite.databaseId,
      'profiles',
      userId,
    );
  }

  async checkUsernameAvailable(username) {
    const res = await databases.listDocuments(appwrite.databaseId, 'profiles', [
      Query.equal('username', username),
    ]);
    return res.total === 0;
  }
}

export const profileApi = new ProfileApi();
