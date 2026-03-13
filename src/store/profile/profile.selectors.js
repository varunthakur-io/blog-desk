import { createSelector } from '@reduxjs/toolkit';

/* ========= Base slice selector ========= */
const selectProfileState = (state) => state.profile;

/* ========= Memoized selectors ========= */

export const selectProfileById = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return null;
    return profileState.byId[String(userId)] || null;
  },
);

export const selectProfileStatus = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return 'idle';
    return profileState.statusById[String(userId)] || 'idle';
  },
);

export const selectProfileError = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return null;
    return profileState.errorById[String(userId)] || null;
  },
);

// Boolean Helpers
export const selectIsProfileLoading = createSelector(
  [selectProfileStatus],
  (status) => status === 'loading',
);
