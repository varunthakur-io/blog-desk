import { databases, appwriteConfig as appwrite } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

class NotificationApi {
  /**
   * Create a new notification record.
   */
  async createNotification(data) {
    return await databases.createDocument(
      appwrite.databaseId,
      appwrite.notificationsCollectionId,
      ID.unique(),
      {
        ...data,
        isRead: false,
      },
    );
  }

  /**
   * List notifications based on custom queries.
   */
  async listNotifications(queries = []) {
    return await databases.listDocuments(
      appwrite.databaseId,
      appwrite.notificationsCollectionId,
      queries,
    );
  }

  /**
   * List notifications for a specific comment.
   */
  async listNotificationsByCommentId(commentId) {
    return await databases.listDocuments(appwrite.databaseId, appwrite.notificationsCollectionId, [
      Query.equal('commentId', commentId),
    ]);
  }

  /**
   * Mark a notification as read.
   */
  async updateNotification(notificationId, data) {
    return await databases.updateDocument(
      appwrite.databaseId,
      appwrite.notificationsCollectionId,
      notificationId,
      data,
    );
  }

  /**
   * Delete a notification.
   */
  async deleteNotification(notificationId) {
    return await databases.deleteDocument(
      appwrite.databaseId,
      appwrite.notificationsCollectionId,
      notificationId,
    );
  }
}

export const notificationApi = new NotificationApi();
