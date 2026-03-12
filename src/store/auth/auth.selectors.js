import { createSelector } from '@reduxjs/toolkit';

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
