import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/auth.slice';
import postReducer from '@/features/posts/store/posts.slice';
import profileReducer from '@/features/profile/store/profile.slice';
import notificationsReducer from '@/features/notifications/store/notifications.slice';
import bookmarksReducer from '@/features/bookmarks/store/bookmarks.slice';


const appReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  profile: profileReducer,
  notifications: notificationsReducer,
  bookmarks: bookmarksReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/clearAuthUser') {
    // Reset all other slices (posts, profile, notifications, bookmarks) by omitting them from state.
    // We pass auth explicitly initialized as a guest to prevent recheck loading states.
    state = {
      auth: {
        user: null,
        status: 'guest',
        initialized: true,
        error: null,
      },
    };
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});