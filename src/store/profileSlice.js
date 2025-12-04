// src/store/profileSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

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

export const { upsertProfile, setProfileLoading, setProfileError } =
  profileSlice.actions;

export default profileSlice.reducer;

/* ========= Base slice selector ========= */
const selectProfileState = (state) => state.profile;

/* ========= Memoized selectors ========= */
export const selectProfileById = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return null;
    return profileState.byId[String(userId)] || null;
  },
);

export const selectProfileLoading = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return false;
    return !!profileState.loadingById[String(userId)];
  },
);

export const selectProfileError = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return null;
    return profileState.errorById[String(userId)] || null;
  },
);
