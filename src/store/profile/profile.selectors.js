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

export const selectProfileLoading = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return false;
    return !!profileState.loadingById[String(userId)];
  },
);

export const selectProfileError = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return null;
    return profileState.errorById[String(userId)] || null;
  },
);
