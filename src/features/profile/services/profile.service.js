import { profileApi } from './profile.api';
import { storageService } from '@/features/posts';
import { Query } from 'appwrite';

class ProfileService {
  async getProfile(userId) {
    return await profileApi.getProfile(userId);
  }

  async getProfileByUsername(username) {
    return await profileApi.getProfileByUsername(username);
  }

  // Keep profile docs keyed by auth user id so the auth/profile relationship stays 1:1 across the app.
  async createProfile(user, username) {
    if (!user || !user.$id) {
      throw new Error('ProfileService :: createProfile() Invalid user');
    }

    // Profile docs intentionally share the auth user id so auth/profile lookups stay 1:1.
    return await profileApi.createProfile(user.$id, {
      name: user.name || 'Anonymous',
      username: username,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
    });
  }

  async updateProfile(userId, profileData) {
    return await profileApi.updateProfile(userId, profileData);
  }

  async updateBio(userId, bio) {
    await profileApi.updateProfile(userId, { bio });
    return true;
  }

  // Replace the old avatar before updating the profile so the stored file reference is always valid.
  async updateAvatar(userId, currentAvatarFileId, file) {
    // Upload replacement first so the profile only points at files that definitely exist.
    const { fileId, fileUrl } = await storageService.uploadFileWithReplacement(
      file,
      currentAvatarFileId,
    );

    return await this.updateProfile(userId, {
      avatarId: fileId,
      avatarUrl: fileUrl,
    });
  }

  async isUsernameAvailable(username) {
    try {
      return await profileApi.checkUsernameAvailable(username);
    } catch {
      return false;
    }
  }

  async getProfilesByIds(userIds) {
    try {
      const response = await profileApi.getProfilesByIds(userIds);
      return response.documents || [];
    } catch (error) {
      console.error('ProfileService :: getProfilesByIds() failed:', error);
      return [];
    }
  }

  async clearProfileById(userId) {
    try {
      return await profileApi.clearProfile(userId);
    } catch {
      return false;
    }
  }

  async searchProfiles(searchTerm) {
    if (!searchTerm) return [];

    // Trim whitespace
    const cleanedsearchTerm = searchTerm.trim();
    if (!searchTerm) return [];
    const query = [
      Query.or([
        Query.contains('username', cleanedsearchTerm),
        Query.contains('name', cleanedsearchTerm),
      ]),
      Query.limit(10),
    ];

    try {
      const res = await profileApi.searchProfiles(query);
      return res.documents || [];
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }
}

export const profileService = new ProfileService();
