import { bookmarkApi } from './bookmark.api';
import { postApi } from '@/features/posts';
import { Query } from 'appwrite';

class BookmarkService {
  async toggleBookmark(userId, postId) {
    if (!userId || !postId) throw new Error('userId and postId are required');

    try {
      const existing = await bookmarkApi.getBookmark(userId, postId);
      if (existing) {
        await bookmarkApi.deleteBookmark(existing.$id);
        return false; // unbookmarked
      } else {
        await bookmarkApi.createBookmark(userId, postId);
        return true; // bookmarked
      }
    } catch (error) {
      console.error('BookmarkService :: toggleBookmark()', error);
      throw error;
    }
  }

  async isBookmarked(userId, postId) {
    if (!userId || !postId) return false;
    try {
      const bookmark = await bookmarkApi.getBookmark(userId, postId);
      return !!bookmark;
    } catch (error) {
      console.error('BookmarkService :: isBookmarked()', error);
      return false;
    }
  }

  async getBookmarkedPostsByUserId(userId) {
    if (!userId) throw new Error('userId is required');
    try {
      const res = await bookmarkApi.listBookmarksByUser(userId);
      const postIds = res.documents.map((b) => b.postId);

      if (postIds.length === 0) return [];

      const postsRes = await postApi.listPosts([
        Query.equal('$id', postIds),
        Query.orderDesc('$createdAt')
      ]);
      return postsRes.documents || [];
    } catch (error) {
      console.error('BookmarkService :: getBookmarkedPostsByUserId()', error);
      throw error;
    }
  }
}

export const bookmarkService = new BookmarkService();
