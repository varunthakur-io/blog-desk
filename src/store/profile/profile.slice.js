import { createSlice } from '@reduxjs/toolkit';
import { set } from 'react-hook-form';

const initialState = {
  byId: {}, // userId -> profile object
  statusById: {}, // userId -> 'idle' | 'loading' | 'error' | 'success'
  errorById: {}, // userId -> string | null
  followersById: {}, // userId -> profile object
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileLoading(state, action) {
      const userId = String(action.payload);
      state.statusById[userId] = 'loading';
      state.errorById[userId] = null;
    },
    // Sets the User Profile object
    setUserProfile(state, action) {
      const profile = action.payload;
      if (!profile?.$id) return;

      const id = String(profile.$id);
      state.byId[id] = {
        ...(state.byId[id] || {}),
        ...profile,
      };
      state.statusById[id] = 'success';
      state.errorById[id] = null;
    },
    setProfileError(state, action) {
      const { userId, error } = action.payload;
      const id = String(userId);
      state.statusById[id] = 'error';
      state.errorById[id] = error || null;
    },
    // Removes the User Profile from cache
    clearUserProfile(state, action) {
      const id = String(action.payload);
      delete state.byId[id];
      delete state.statusById[id];
      delete state.errorById[id];
    },
    setFollowers(state, action) {
      const followers = action.payload;
      if (!followers) return;
      followers.forEach((element) => {
        const id = String(element.$id);
        state.followersById[id] = {
          ...element,
        };
      });
    },
  },
});

export const {
  setProfileLoading,
  setUserProfile,
  setProfileError,
  clearUserProfile,
  setFollowers,
} = profileSlice.actions;

export default profileSlice.reducer;
