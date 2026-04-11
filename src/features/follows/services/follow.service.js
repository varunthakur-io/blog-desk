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

  async followUser(followerId, followingId) {
    try {
      if (followerId === followingId) throw new Error('You cannot follow yourself');

      // Check if already following to avoid duplicates
      const existing = await followApi.getFollowRelationship(followerId, followingId);
      if (existing) return existing;

      const follow = await followApi.followUser(followerId, followingId);

      // Increment followerCount and followingCount (denormalized)
      const followerProfile = await profileService.getProfile(followerId);
      const followingProfile = await profileService.getProfile(followingId);

      await profileService.updateProfile(followerId, {
        followingCount: (followerProfile.followingCount || 0) + 1,
      });

      await profileService.updateProfile(followingId, {
        followersCount: (followingProfile.followersCount || 0) + 1,
      });

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

      // Decrement followerCount and followingCount
      const followerProfile = await profileService.getProfile(followerId);
      const followingProfile = await profileService.getProfile(followingId);

      await profileService.updateProfile(followerId, {
        followingCount: Math.max(0, (followerProfile.followingCount || 0) - 1),
      });

      await profileService.updateProfile(followingId, {
        followersCount: Math.max(0, (followingProfile.followersCount || 0) - 1),
      });

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
