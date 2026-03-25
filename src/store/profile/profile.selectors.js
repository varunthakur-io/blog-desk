import { createSelector } from '@reduxjs/toolkit';

/* ========= Base slice selector ========= */
const selectProfileState = (state) => state.profile;

/* ========= Primary Data Selectors ========= */

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

export const selectFollowerIds = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return [];
    return profileState.followersByUserId[String(userId)] || [];
  },
);

export const selectFollowers = createSelector(
  [selectFollowerIds, selectProfileState],
  (ids, profileState) => ids.map((id) => profileState.byId[id]).filter(Boolean),
);

export const selectFollowingIds = createSelector(
  [selectProfileState, (_, userId) => userId],
  (profileState, userId) => {
    if (!userId) return [];
    return profileState.followingByUserId[String(userId)] || [];
  },
);

export const selectFollowing = createSelector(
  [selectFollowingIds, selectProfileState],
  (ids, profileState) => ids.map((id) => profileState.byId[id]).filter(Boolean),
);

/* ========= Semantic Helpers ========= */

export const selectIsProfileLoading = createSelector(
  [selectProfileStatus],
  (status) => status === 'loading',
);

/* ========= Computed Attributes ========= */

// Groups all count-based metrics into a single object for UI convenience
export const selectProfileStats = createSelector([selectProfileById], (profile) => ({
  followers: profile?.followersCount || 0,
  following: profile?.followingCount || 0,
  posts: profile?.postsCount || 0,
}));
