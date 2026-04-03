import { notificationApi } from './notification.api';

class NotificationService {
  /**
   * Send a notification to a recipient.
   * Gracefully handles cases where the notification collection might not exist yet.
   */
  async notify({ recipientId, senderId, type, postId = null, commentId = null }) {
    // Don't notify if user is interacting with their own content
    if (recipientId === senderId) return null;

    try {
      return await notificationApi.createNotification({
        recipientId,
        senderId,
        type,
        postId,
        commentId,
      });
    } catch (error) {
      // Log error but don't crash the main action (like/follow/comment)
      console.warn('NotificationService :: notify() failed:', error);
      return null;
    }
  }

  /**
   * Fetch recent notifications for a user.
   */
  async getNotifications(userId) {
    try {
      const res = await notificationApi.listNotifications(userId);
      return res.documents || [];
    } catch (error) {
      console.error('NotificationService :: getNotifications() failed:', error);
      return [];
    }
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId) {
    try {
      return await notificationApi.updateNotification(notificationId, { isRead: true });
    } catch (error) {
      console.error('NotificationService :: markAsRead() failed:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId) {
    try {
      const unread = await notificationApi.listNotifications(userId, 100);
      const unreadIds = unread.documents
        .filter((n) => !n.isRead)
        .map((n) => n.$id);

      const promises = unreadIds.map((id) => this.markAsRead(id));
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('NotificationService :: markAllAsRead() failed:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
