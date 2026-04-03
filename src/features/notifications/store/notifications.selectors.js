export const selectAllNotifications = (state) => state.notifications.items;
export const selectUnreadNotificationsCount = (state) => state.notifications.unreadCount;
export const selectNotificationsStatus = (state) => state.notifications.status;
export const selectNotificationsError = (state) => state.notifications.error;
