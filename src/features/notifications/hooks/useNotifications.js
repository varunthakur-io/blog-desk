import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import client from '@/lib/appwrite';
import { config } from '@/lib/config';
import { notificationService } from '../services/notification.service';
import {
  setNotifications,
  addNotification,
  removeNotification,
  setNotificationsStatus,
  setNotificationsError,
  selectUnreadNotificationsCount,
} from '../store';
import { selectAuthUserId } from '@/features/auth';
import toast from 'react-hot-toast';

/**
 * Hook to manage real-time notifications.
 * Listens to Appwrite Realtime events and updates Redux store.
 */
export const useNotifications = () => {
  const dispatch = useDispatch();
  const authUserId = useSelector(selectAuthUserId);
  const unreadCount = useSelector(selectUnreadNotificationsCount);

  const fetchInitialNotifications = useCallback(async () => {
    if (!authUserId) return;

    dispatch(setNotificationsStatus('loading'));
    try {
      const data = await notificationService.getNotifications(authUserId);
      dispatch(setNotifications(data));
    } catch (error) {
      dispatch(setNotificationsError(error.message));
    }
  }, [authUserId, dispatch]);

  useEffect(() => {
    if (!authUserId) return;

    // 1. Initial Fetch
    fetchInitialNotifications();

    // 2. Subscribe to Realtime
    const channel = `databases.${config.appwrite.databaseId}.collections.${config.appwrite.collections.notifications}.documents`;

    const unsubscribe = client.subscribe(channel, (response) => {
      // Check if the event is a new document and belongs to the current user
      const { events, payload } = response;

      // Handle Creation
      if (events.some((e) => e.includes('.create')) && payload.recipientId === authUserId) {
        dispatch(addNotification(payload));

        // Show a toast for the notification
        const message = getNotificationMessage(payload);
        if (message) {
          toast.success(message, {
            icon: '🔔',
            duration: 4000,
          });
        }
      }

      // Handle Deletion
      if (events.some((e) => e.includes('.delete'))) {
        dispatch(removeNotification(payload.$id));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [authUserId, fetchInitialNotifications, dispatch]);

  return {
    unreadCount,
    fetchInitialNotifications,
  };
};

/**
 * Helper to generate human-readable notification messages.
 */
function getNotificationMessage(notification) {
  switch (notification.type) {
    case 'like':
      return 'Someone liked your post!';
    case 'follow':
      return 'You have a new follower!';
    case 'comment':
      return 'Someone commented on your post!';
    default:
      return 'You have a new notification';
  }
}
