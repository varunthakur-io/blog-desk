import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // array of notification objects
  unreadCount: 0,
  status: 'idle', // idle | loading | success | error
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.items = action.payload || [];
      state.unreadCount = state.items.filter((n) => !n.isRead).length;
      state.status = 'success';
    },
    addNotification(state, action) {
      const notification = action.payload;
      if (state.items.some((item) => item.$id === notification.$id)) {
        return;
      }
      state.items.unshift(notification);
      if (!notification.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead(state, action) {
      const id = action.payload;
      const item = state.items.find((n) => n.$id === id);
      if (item && !item.isRead) {
        item.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.items.forEach((item) => {
        item.isRead = true;
      });
      state.unreadCount = 0;
    },
    removeNotification(state, action) {
      const id = action.payload;
      const item = state.items.find((n) => n.$id === id);
      if (item) {
        if (!item.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter((n) => n.$id !== id);
      }
    },
    setNotificationsStatus(state, action) {
      state.status = action.payload || 'idle';
    },
    setNotificationsError(state, action) {
      state.status = 'error';
      state.error = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setNotificationsStatus,
  setNotificationsError,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
