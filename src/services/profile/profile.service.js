import { profileApi } from './profile.api';
import { storageService } from '../storage';

class ProfileService {
  async getProfile(userId) {
    try {
      return await profileApi.getProfile(userId);
    } catch (error) {
      console.error('ProfileService :: getProfile()', error);
      throw error;
    }
  }

  async getProfileByUsername(username) {
    try {
      return await profileApi.getProfileByUsername(username);
    } catch (error) {
      console.error('ProfileService :: getProfileByUsername()', error);
      throw error;
    }
  }

  async createProfile(user, username) {
    if (!user || !user.$id) {
      throw new Error('ProfileService :: createProfile() Invalid user');
    }
    return await profileApi.createProfile(user.$id, {
      name: user.name || 'Anonymous',
      username: username,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
    });
  }

  async updateProfile(userId, profileData) {
    try {
      return await profileApi.updateProfile(userId, profileData);
    } catch (error) {
      console.error('ProfileService :: updateProfile()', error);
      throw error;
    }
  }

  async updateBio(userId, bio) {
    try {
      await profileApi.updateProfile(userId, { bio });
      return true;
    } catch (error) {
      console.error('ProfileService :: updateBio()', error);
      throw error;
    }
  }

  async updateAvatar(userId, currentAvatarFileId, file) {
    try {
      const { fileId, fileUrl } = await storageService.uploadFileWithReplacement(file, currentAvatarFileId);

      const updatedProfile = await this.updateProfile(userId, {
        avatarId: fileId,
        avatarUrl: fileUrl,
      });
      return updatedProfile;
    } catch (error) {
      console.error('ProfileService :: updateAvatar()', error);
      throw error;
    }
  }

  async isUsernameAvailable(username) {
    try {
      return await profileApi.checkUsernameAvailable(username);
    } catch (error) {
      console.error('ProfileService :: isUsernameAvailable()', error);
      return false;
    }
  }

  async deleteProfile(userId) {
    try {
      return await profileApi.deleteProfile(userId);
    } catch (error) {
      console.warn('ProfileService :: deleteProfile()', error);
      return false;
    }
  }
}

export const profileService = new ProfileService();
