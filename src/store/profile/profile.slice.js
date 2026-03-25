import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {},
  followersByUserId: {},
  followingByUserId: {},
  statusById: {},
  errorById: {},
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Sets the loading state for a specific profile
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

      // optional: clean relationships
      delete state.followersByUserId[id];
    },

    setFollowers(state, action) {
      const { userId, profiles } = action.payload;
      if (!userId || !profiles) return;

      const uid = String(userId);

      state.followersByUserId[uid] = profiles.map((profile) => {
        const id = String(profile.$id);

        // normalize into byId
        state.byId[id] = {
          ...(state.byId[id] || {}),
          ...profile,
        };

        return id;
      });
    },

    setFollowing(state, action) {
      const { userId, profiles } = action.payload;
      if (!userId || !profiles) return;

      const uid = String(userId);

      state.followingByUserId[uid] = profiles.map((profile) => {
        const id = String(profile.$id);
        state.byId[id] = {
          ...(state.byId[id] || {}),
          ...profile,
        };
        return id;
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
  setFollowing,
} = profileSlice.actions;

export default profileSlice.reducer;
