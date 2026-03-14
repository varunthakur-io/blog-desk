// src/store/auth/auth.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: 'idle', // idle, authenticated, guest
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Sets the specific auth phase ('idle' | 'loading' | etc.)
    setAuthStatus(state, action) {
      state.status = action.payload || 'idle';
      state.error = null;
    },
    setAuthUser(state, action) {
      const user = action.payload ?? null;
      state.user = user;
      state.status = user ? 'authenticated' : 'guest';
      state.initialized = true;
      state.error = null;
    },
    setAuthError(state, action) {
      state.user = null;
      state.status = 'guest';
      state.error = action.payload || null;
      state.initialized = true;
    },
    clearAuthUser(state) {
      state.user = null;
      state.status = 'guest';
      state.error = null;
      state.initialized = true;
    },
  },
});

export const { setAuthStatus, setAuthUser, setAuthError, clearAuthUser } =
  authSlice.actions;

export default authSlice.reducer;
