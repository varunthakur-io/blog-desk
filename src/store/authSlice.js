// src/store/authSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

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

/* ========= Base slice selector ========= */
const selectAuthState = (state) => state.auth;

/* ========= Memoized selectors ========= */
export const selectAuthUserId = createSelector(
  [selectAuthState],
  (authState) => authState.userId,
);

export const selectAuthStatus = createSelector(
  [selectAuthState],
  (authState) => authState.status,
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (authState) => authState.loading,
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (authState) => authState.error,
);
