// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  loading: false,
  status: 'guest', // 'guest' | 'authenticated'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload || null;
    },

    // Called after login
    setAuthUserId(state, action) {
      const userId = action.payload ?? null;

      state.userId = userId;
      state.status = userId ? 'authenticated' : 'guest';
      state.error = null;
    },

    clearAuthUserId(state) {
      state.userId = null;
      state.status = 'guest';
      state.error = null;
    },
  },
});

export const { setAuthLoading, setAuthError, setAuthUserId, clearAuthUserId } =
  authSlice.actions;

export default authSlice.reducer;

// -------- Selectors ----------
export const selectAuthUserId = (state) => state.auth.userId;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
