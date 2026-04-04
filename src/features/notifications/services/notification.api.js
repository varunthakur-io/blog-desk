import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { config } from '@/lib/config';

const { databaseId, collections } = config.appwrite;

export const notificationApi = {
  /**
   * Create a new notification record.
   */
  async createNotification(data) {
    return await databases.createDocument(databaseId, collections.notifications, ID.unique(), {
      ...data,
      isRead: false,
    });
  },

  /**
   * List notifications based on custom queries.
   */
  async listNotifications(queries = []) {
    return await databases.listDocuments(databaseId, collections.notifications, queries);
  },

  /**
   * List notifications for a specific comment.
   */
  async listNotificationsByCommentId(commentId) {
    return await databases.listDocuments(databaseId, collections.notifications, [
      Query.equal('commentId', commentId),
    ]);
  },

  /**
   * Mark a notification as read.
   */
  async updateNotification(notificationId, data) {
    return await databases.updateDocument(
      databaseId,
      collections.notifications,
      notificationId,
      data,
    );
  },

  /**
   * Delete a notification.
   */
  async deleteNotification(notificationId) {
    return await databases.deleteDocument(databaseId, collections.notifications, notificationId);
  },
};
