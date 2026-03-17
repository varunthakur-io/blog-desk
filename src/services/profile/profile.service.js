import { profileApi } from './profile.api';
import { storageService } from '../storage';

class ProfileService {
  async getProfile(userId) {
    return await profileApi.getProfile(userId);
  }

  async getProfileByUsername(username) {
    return await profileApi.getProfileByUsername(username);
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
    return await profileApi.updateProfile(userId, profileData);
  }

  async updateBio(userId, bio) {
    await profileApi.updateProfile(userId, { bio });
    return true;
  }

  async updateAvatar(userId, currentAvatarFileId, file) {
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

  async clearProfileById(userId) {
    try {
      return await profileApi.clearProfile(userId);
    } catch {
      return false;
    }
  }
}

export const profileService = new ProfileService();
