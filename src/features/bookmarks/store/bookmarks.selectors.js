import { createSelector } from '@reduxjs/toolkit';

export const selectBookmarksState = (state) => state.bookmarks;

export const selectAllBookmarks = createSelector(
  [selectBookmarksState],
  (bookmarks) => bookmarks.items,
);

export const selectBookmarkIds = createSelector(
  [selectBookmarksState],
  (bookmarks) => bookmarks.ids,
);

export const selectIsPostBookmarked = (state, postId) => state.bookmarks.ids.includes(postId);

export const selectBookmarksStatus = createSelector(
  [selectBookmarksState],
  (bookmarks) => bookmarks.status,
);

export const selectBookmarksError = createSelector(
  [selectBookmarksState],
  (bookmarks) => bookmarks.error,
);
