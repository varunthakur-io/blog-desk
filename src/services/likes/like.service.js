import { likeApi } from './like.api';
import { postApi } from '../posts/post.api';
import { Query } from 'appwrite';

const likedCache = new Map();

class LikeService {
  async _updateLikesCount(postId, increment) {
    try {
      const doc = await postApi.getPostById(postId);
      const current = doc.likesCount ?? 0;
      const next = Math.max(0, current + increment);
      await postApi.updatePost(postId, { likesCount: next });
    } catch (error) {
      console.error('LikeService :: _updateLikesCount()', error);
      throw error;
    }
  }

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

  async likePost(postId, userId) {
    const key = `${userId}:${postId}`;
    try {
      const existing = await this.hasUserLiked(postId, userId);
      if (existing) return;

      await likeApi.createLike(postId, userId);
      await this._updateLikesCount(postId, 1);
      likedCache.set(key, true);
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

  async getLikedPostsByUserId(userId) {
    if (!userId) throw new Error('getLikedPostsByUserId: "userId" is required');
    try {
      const likesRes = await likeApi.listLikesByUser(userId);
      const likeDocs = likesRes.documents || [];
      const postIds = likeDocs.map((doc) => doc.postId).filter(Boolean);

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
