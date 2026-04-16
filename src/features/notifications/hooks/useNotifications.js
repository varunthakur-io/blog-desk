import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import client from '@/lib/appwrite';
import { config } from '@/lib/config';
import { notificationService } from '../services/notification.service';
import {
  setNotifications,
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

  const normalizeId = useCallback((value) => (value ? String(value) : null), []);

  const fetchInitialNotifications = useCallback(async () => {
    if (!authUserId) return;

    dispatch(setNotificationsStatus('loading'));
    try {
      const data = await notificationService.getNotifications(authUserId);
      const currentUserId = normalizeId(authUserId);
      const scopedNotifications = data.filter(
        (notification) => normalizeId(notification?.recipientId) === currentUserId,
      );
      dispatch(setNotifications(scopedNotifications));
    } catch (error) {
      dispatch(setNotificationsError(error.message));
    }
  }, [authUserId, dispatch, normalizeId]);

  useEffect(() => {
    if (!authUserId) return;

    // 1. Initial Fetch
    fetchInitialNotifications();

    // 2. Subscribe to Realtime
    const channel = `databases.${config.appwrite.databaseId}.collections.${config.appwrite.collections.notifications}.documents`;

    const unsubscribe = client.subscribe(channel, (response) => {
      const { events, payload } = response;
      const currentUserId = normalizeId(authUserId);
      const payloadRecipientId = normalizeId(payload?.recipientId);
      const isRecipientEvent = payloadRecipientId === currentUserId;

      // Handle Creation
      if (events.some((e) => e.includes('.create')) && isRecipientEvent) {
        fetchInitialNotifications();

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
        fetchInitialNotifications();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [authUserId, fetchInitialNotifications, normalizeId]);

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
