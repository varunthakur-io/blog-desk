import { createSelector } from '@reduxjs/toolkit';

const selectPostsState = (state) => state.posts;

/* ========= Primary Data Selectors ========= */

// Returns all posts in sorted order
export const selectAllPosts = createSelector([selectPostsState], (postsState) =>
  postsState.allIds.map((id) => postsState.byId[id]).filter(Boolean),
);

// Returns a single post by its document ID
export const selectPostById = createSelector(
  [selectPostsState, (_, postId) => postId],
  (postsState, postId) => {
    if (!postId) return undefined;
    return postsState.byId[String(postId)];
  },
);

// Filters posts by author ID
export const selectPostsByAuthor = createSelector(
  [selectAllPosts, (_, authorId) => authorId],
  (allPosts, authorId) => {
    if (!authorId) return [];
    return allPosts.filter((p) => p && String(p.authorId) === String(authorId));
  },
);

/* ========= Semantic Helpers (Boolean) ========= */

export const selectIsPostsLoading = createSelector(
  [selectPostsState],
  (postsState) => postsState.status === 'loading',
);

export const selectPostsError = createSelector(
  [selectPostsState],
  (postsState) => postsState.error,
);

/* ========= Pagination Selectors ========= */

const selectPagination = createSelector(
  [selectPostsState],
  (postsState) => postsState.pagination
);

export const selectPage = createSelector(
  [selectPagination],
  (pagination) => pagination.page
);

export const selectHasMore = createSelector(
  [selectPagination],
  (pagination) => pagination.hasMore
);

export const selectInitialLoaded = createSelector(
  [selectPagination],
  (pagination) => pagination.initialLoaded
);
