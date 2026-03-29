import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/auth.slice';
import postReducer from '@/features/posts/store/posts.slice';
import profileReducer from '@/features/profile/store/profile.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    profile: profileReducer,
  },
});
