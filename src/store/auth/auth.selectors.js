import { createSelector } from '@reduxjs/toolkit';

const selectAuthState = (state) => state.auth;

export const selectAuthUser = createSelector(
  [selectAuthState],
  (authState) => authState.user,
);

export const selectAuthStatus = createSelector(
  [selectAuthState],
  (authState) => authState.status,
);

export const selectIsAuthInitialized = createSelector(
  [selectAuthState],
  (authState) => authState.initialized,
);

export const selectAuthUserId = createSelector(
  [selectAuthUser],
  (user) => user?.$id || null,
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (authState) => authState.error,
);

// Boolean Helpers
export const selectIsAuthLoading = createSelector(
  [selectAuthStatus],
  (status) => status === 'loading',
);

export const selectIsAuthenticated = createSelector(
  [selectAuthStatus],
  (status) => status === 'authenticated',
);
