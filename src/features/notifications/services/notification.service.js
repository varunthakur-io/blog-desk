import { Query } from 'appwrite';
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
      const queries = [
        Query.equal('recipientId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(20),
      ];
      const res = await notificationApi.listNotifications(queries);
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
      const unreadQueries = [Query.equal('recipientId', userId), Query.equal('isRead', false)];
      const unread = await notificationApi.listNotifications(unreadQueries);
      const unreadIds = unread.documents.map((n) => n.$id);

      const promises = unreadIds.map((id) => this.markAsRead(id));
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('NotificationService :: markAllAsRead() failed:', error);
      return false;
    }
  }

  /**
   * Delete notifications associated with a specific comment.
   * Useful when a comment is deleted.
   */
  async deleteNotificationByCommentId(commentId) {
    try {
      const res = await notificationApi.listNotificationsByCommentId(commentId);

      if (res.documents.length === 0) return;

      const deletePromises = res.documents.map((doc) =>
        notificationApi.deleteNotification(doc.$id),
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('NotificationService :: deleteNotificationByCommentId() failed:', error);
    }
  }

  /**
   * Delete a follow notification.
   * Useful when a user unfollows someone.
   */
  async deleteFollowNotification(senderId, recipientId) {
    try {
      const queries = [
        Query.equal('senderId', senderId),
        Query.equal('recipientId', recipientId),
        Query.equal('type', 'follow'),
      ];

      const res = await notificationApi.listNotifications(queries);

      if (res.documents.length === 0) return;

      const deletePromises = res.documents.map((doc) =>
        notificationApi.deleteNotification(doc.$id),
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('NotificationService :: deleteFollowNotification() failed:', error);
    }
  }

  async deleteLikeNotification(senderId, recipientId, postId) {
    try {
      const queries = [
        Query.equal('senderId', senderId),
        Query.equal('recipientId', recipientId),
        Query.equal('postId', postId),
        Query.equal('type', 'like'),
      ];

      const res = await notificationApi.listNotifications(queries);
      if (res.documents.length === 0) return;
      const deletePromises = res.documents.map((doc) =>
        notificationApi.deleteNotification(doc.$id),
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('NotificationService :: deleteLikeNotification() failed:', error);
    }
  }

  /**
   * Delete all notifications related to a specific post.
   * Useful when a post is deleted.
   */
  async deleteNotificationsByPostId(postId) {
    try {
      const queries = [Query.equal('postId', postId)];
      const res = await notificationApi.listNotifications(queries);

      if (res.documents.length === 0) return;

      const deletePromises = res.documents.map((doc) =>
        notificationApi.deleteNotification(doc.$id),
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('NotificationService :: deleteNotificationsByPostId() failed:', error);
    }
  }
}

export const notificationService = new NotificationService();
