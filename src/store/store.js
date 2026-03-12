import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import postReducer from './posts/posts.slice';
import profileReducer from './profile/profile.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    profile: profileReducer,
  },
});
