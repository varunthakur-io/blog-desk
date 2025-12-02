// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null, // Appwrite user.$id
  name: null,
  email: null,

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

    // Called after login / getAccount when we know the current user
    setAuthUser(state, action) {
      const { userId, name, email } = action.payload || {};

      state.userId = userId ?? null;
      state.name = name ?? null;
      state.email = email ?? null;
      state.status = userId ? 'authenticated' : 'guest';
      state.error = null;
    },

    // Called on logout
    clearAuthUser(state) {
      state.userId = null;
      state.name = null;
      state.email = null;
      state.status = 'guest';
      state.error = null;
    },
  },
});

export const { setAuthLoading, setAuthError, setAuthUser, clearAuthUser } =
  authSlice.actions;

export default authSlice.reducer;

// ---------- Selectors ----------
export const selectAuthUserId = (state) => state.auth.userId;
export const selectAuthName = (state) => state.auth.name;
export const selectAuthEmail = (state) => state.auth.email;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
