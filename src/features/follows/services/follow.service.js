import { followApi } from './follow.api';
import { profileService } from '@/features/profile';

class FollowService {
  async isFollowing(followerId, followingId) {
    if (!followerId || !followingId) return false;
    const follow = await followApi.getFollowRelationship(followerId, followingId);
    return !!follow;
  }

  async followUser(followerId, followingId) {
    if (followerId === followingId) throw new Error('You cannot follow yourself');

    // Check if already following to avoid duplicates
    const existing = await followApi.getFollowRelationship(followerId, followingId);
    if (existing) return existing;

    const follow = await followApi.followUser(followerId, followingId);

    // Increment followerCount and followingCount (denormalized)
    // In a real production app, these would ideally be handled by an Appwrite Function (serverless)
    // for atomicity, but here we do it client-side for simplicity.
    const followerProfile = await profileService.getProfile(followerId);
    const followingProfile = await profileService.getProfile(followingId);

    await profileService.updateProfile(followerId, {
      followingCount: (followerProfile.followingCount || 0) + 1,
    });

    await profileService.updateProfile(followingId, {
      followersCount: (followingProfile.followersCount || 0) + 1,
    });

    return follow;
  }

  async unfollowUser(followerId, followingId) {
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
  }

  async getFollowers(userId) {
    const response = await followApi.getFollowers(userId);
    return response.documents || [];
  }

  async getFollowing(userId) {
    const response = await followApi.getFollowing(userId);
    return response.documents || [];
  }
}

export const followService = new FollowService();
