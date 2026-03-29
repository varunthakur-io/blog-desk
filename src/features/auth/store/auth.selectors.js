import { createSelector } from '@reduxjs/toolkit';

const selectAuthState = (state) => state.auth;

/* ========= Primary Data Selectors ========= */

export const selectAuthUser = createSelector([selectAuthState], (authState) => authState.user);

export const selectAuthStatus = createSelector([selectAuthState], (authState) => authState.status);

export const selectAuthError = createSelector([selectAuthState], (authState) => authState.error);

/* ========= Semantic Helpers ========= */

// 1. App Boot Flag
export const selectIsAuthInitialized = createSelector(
  [selectAuthState],
  (authState) => authState.initialized,
);

// 2. Identity Check
export const selectIsAuthenticated = createSelector(
  [selectAuthStatus],
  (status) => status === 'authenticated',
);

// 3. Guest Check
export const selectIsGuest = createSelector([selectAuthStatus], (status) => status === 'guest');

// 4. Activity Check
export const selectIsAuthLoading = createSelector(
  [selectAuthStatus],
  (status) => status === 'loading',
);

/* ========= Attribute Extraction ========= */

export const selectAuthUserId = createSelector([selectAuthUser], (user) => user?.$id || null);

export const selectAuthName = createSelector([selectAuthUser], (user) => user?.name || 'User');

export const selectAuthEmail = createSelector([selectAuthUser], (user) => user?.email || '');
