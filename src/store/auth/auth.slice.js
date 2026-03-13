// src/store/auth/auth.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null, // Derived for quick access
  userData: null, // Full Appwrite user object { $id, email, name, etc. }
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
      const user = action.payload ?? null;

      state.userData = user;
      state.userId = user?.$id ?? null;
      state.status = user ? 'authenticated' : 'guest';
      state.error = null;
    },

    clearAuthUserId(state) {
      state.userData = null;
      state.userId = null;
      state.status = 'guest';
      state.error = null;
    },
  },
});

export const { setAuthLoading, setAuthError, setAuthUserId, clearAuthUserId } =
  authSlice.actions;

export default authSlice.reducer;
