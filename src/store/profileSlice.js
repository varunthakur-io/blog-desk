import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profiles: {}, // keyed by profileId
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      const { profileId, data } = action.payload;
      state.profiles[profileId] = data;
      state.loading = false;
      state.error = null;
    },
    setProfileLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProfileError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProfile: (state, action) => {
      const { profileId } = action.payload;
      delete state.profiles[profileId];
    },
    clearAllProfiles: (state) => {
      state.profiles = {};
    },
  },
});

export const {
  setProfile,
  setProfileLoading,
  setProfileError,
  clearProfile,
  clearAllProfiles,
} = profileSlice.actions;

export default profileSlice.reducer;
