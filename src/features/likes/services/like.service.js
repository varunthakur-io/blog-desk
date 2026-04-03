import { likeApi } from './like.api';
import { postApi } from '@/features/posts';
import { notificationService } from '@/features/notifications/services/notification.service';
import { Query } from 'appwrite';

// Cache the current user's like lookups to avoid refetching the same relation on every render.
const likedCache = new Map();

class LikeService {
  async _updateLikesCount(postId, increment) {
    try {
      const postDocument = await postApi.getPostById(postId);
      const current = postDocument.likesCount ?? 0;
      const next = Math.max(0, current + increment);
      await postApi.updatePost(postId, { likesCount: next });
    } catch (error) {
      console.error('LikeService :: _updateLikesCount()', error);
      throw error;
    }
  }

  // Cache the current user's like relation per post to avoid repeating the same lookup during list/detail renders.
  async hasUserLiked(postId, userId) {
    const key = `${userId}:${postId}`;
    if (likedCache.has(key)) {
      return likedCache.get(key);
    }
    try {
      const like = await likeApi.getLike(postId, userId);
      const liked = !!like;
      likedCache.set(key, liked);
      return liked;
    } catch (error) {
      console.error('LikeService :: hasUserLiked()', error);
      return false;
    }
  }

  // Requery the backend before creating so duplicate like rows are not produced by repeated clicks.
  async likePost(postId, userId) {
    const key = `${userId}:${postId}`;
    try {
      // Recheck against the backend/cache before creating to avoid duplicate like rows.
      const existing = await this.hasUserLiked(postId, userId);
      if (existing) return;

      await likeApi.createLike(postId, userId);
      await this._updateLikesCount(postId, 1);
      likedCache.set(key, true);

      // Trigger Notification
      const post = await postApi.getPostById(postId);
      if (post && post.authorId !== userId) {
        await notificationService.notify({
          recipientId: post.authorId,
          senderId: userId,
          type: 'like',
          postId: postId
        });
      }
    } catch (error) {
      console.error('LikeService :: likePost()', error);
      throw error;
    }
  }

  async unlikePost(postId, userId) {
    const key = `${userId}:${postId}`;
    try {
      const like = await likeApi.getLike(postId, userId);
      if (like) {
        await likeApi.deleteLike(like.$id);
        await this._updateLikesCount(postId, -1);
        likedCache.set(key, false);
      }
    } catch (error) {
      console.error('LikeService :: unlikePost()', error);
      throw error;
    }
  }

  // Skip the post query entirely when the user has no likes because Appwrite rejects an empty Query.equal array.
  async getLikedPostsByUserId(userId) {
    if (!userId) throw new Error('getLikedPostsByUserId: "userId" is required');
    try {
      const likesRes = await likeApi.listLikesByUser(userId);
      const likeDocs = likesRes.documents || [];
      const postIds = likeDocs.map((likeDoc) => likeDoc.postId).filter(Boolean);

      // Appwrite does not accept an empty Query.equal array.
      if (postIds.length === 0) return [];

      return await postApi.listPosts([Query.equal('$id', postIds), Query.orderDesc('$createdAt')]);
    } catch (error) {
      console.error('LikeService :: getLikedPostsByUserId()', error);
      throw error;
    }
  }

  async deleteLikesByPostId(postId) {
    if (!postId) throw new Error('deleteLikesByPostId: "postId" is required');
    try {
      const likesList = await likeApi.listLikesByPost(postId);
      const deletePromises = likesList.documents.map((like) => likeApi.deleteLike(like.$id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('LikeService :: deleteLikesByPostId()', error);
      throw error;
    }
  }
}

export const likeService = new LikeService();
