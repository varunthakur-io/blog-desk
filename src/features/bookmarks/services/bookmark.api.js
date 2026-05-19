import { databases, appwriteConfig as appwrite } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

class BookmarkApi {
  async createBookmark(userId, postId) {
    return await databases.createDocument(
      appwrite.databaseId,
      appwrite.bookmarksCollectionId, // This needs to be added to config/env
      ID.unique(),
      {
        userId,
        postId,
      },
    );
  }

  async getBookmark(userId, postId) {
    const res = await databases.listDocuments(appwrite.databaseId, appwrite.bookmarksCollectionId, [
      Query.equal('userId', userId),
      Query.equal('postId', postId),
    ]);
    return res.documents[0] || null;
  }

  async listBookmarksByUser(userId, limit = 100) {
    return await databases.listDocuments(appwrite.databaseId, appwrite.bookmarksCollectionId, [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
    ]);
  }

  async deleteBookmark(bookmarkId) {
    return await databases.deleteDocument(
      appwrite.databaseId,
      appwrite.bookmarksCollectionId,
      bookmarkId,
    );
  }
}

export const bookmarkApi = new BookmarkApi();
