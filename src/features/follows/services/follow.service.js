import { followApi } from './follow.api';
import { profileService } from '@/features/profile';
import { notificationService } from '@/features/notifications/services/notification.service';
import { parseApiError } from '@/lib/error-handler';

class FollowService {
  async isFollowing(followerId, followingId) {
    if (!followerId || !followingId) return false;
    try {
      const follow = await followApi.getFollowRelationship(followerId, followingId);
      return !!follow;
    } catch {
      return false;
    }
  }

  async _updateFollowingCount(userId) {
    try {
      const total = await followApi.getFollowingCount(userId);
      await profileService.updateProfile(userId, { followingCount: total });
    } catch (error) {
      console.warn(`FollowService :: Failed to update following count for ${userId}`, error);
    }
  }

  async _updateFollowersCount(userId) {
    try {
      const total = await followApi.getFollowersCount(userId);
      await profileService.updateProfile(userId, { followersCount: total });
    } catch (error) {
      console.warn(`FollowService :: Failed to update followers count for ${userId}`, error);
    }
  }

  async followUser(followerId, followingId) {
    try {
      if (followerId === followingId) throw new Error('You cannot follow yourself');

      // Check if already following to avoid duplicates
      const existing = await followApi.getFollowRelationship(followerId, followingId);
      if (existing) return existing;

      const follow = await followApi.followUser(followerId, followingId);

      // Recount counts for both parties
      await this._updateFollowingCount(followerId);
      await this._updateFollowersCount(followingId);

      // Trigger Notification
      await notificationService.notify({
        recipientId: followingId,
        senderId: followerId,
        type: 'follow',
      });

      return follow;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async unfollowUser(followerId, followingId) {
    try {
      const follow = await followApi.getFollowRelationship(followerId, followingId);
      if (!follow) return;

      await followApi.unfollowUser(follow.$id);

      // Recount counts for both parties
      await this._updateFollowingCount(followerId);
      await this._updateFollowersCount(followingId);

      // Cleanup associated follow notification
      await notificationService.deleteFollowNotification(followerId, followingId);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async getFollowers(userId) {
    try {
      const response = await followApi.getFollowers(userId);
      return response.documents || [];
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async getFollowing(userId) {
    try {
      const response = await followApi.getFollowing(userId);
      return response.documents || [];
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }
}

export const followService = new FollowService();
