// src/store/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {
    // [userId]: { $id, name, bio, avatarUrl, followersCount, ... }
  },
  loadingById: {
    // [userId]: boolean
  },
  errorById: {
    // [userId]: string | null
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    upsertProfile(state, action) {
      const profile = action.payload;
      if (!profile?.$id) return;

      const id = String(profile.$id);

      // Merge with existing (so we can add custom fields like likedPosts, posts, etc.)
      state.byId[id] = {
        ...(state.byId[id] || {}),
        ...profile,
      };
    },

    setProfileLoading(state, action) {
      const { userId, loading } = action.payload;
      if (!userId) return;
      state.loadingById[String(userId)] = !!loading;
    },

    setProfileError(state, action) {
      const { userId, error } = action.payload;
      if (!userId) return;
      state.errorById[String(userId)] = error || null;
    },
  },
});

export const {
  upsertProfile,
  upsertProfiles,
  setProfileLoading,
  setProfileError,
  setProfileExtra,
} = profileSlice.actions;

export default profileSlice.reducer;

// --------- Selectors ----------
export const selectProfileById = (state, userId) => {
  if (!userId) return null;
  return state.profile.byId[String(userId)] || null;
};

export const selectProfileLoading = (state, userId) => {
  if (!userId) return false;
  return !!state.profile.loadingById[String(userId)];
};

export const selectProfileError = (state, userId) => {
  if (!userId) return null;
  return state.profile.errorById[String(userId)] || null;
};
