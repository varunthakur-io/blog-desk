import { createSelector } from '@reduxjs/toolkit';

/* ========= Base slice selector ========= */
const selectPostsState = (state) => state.posts;

/* ========= Memoized selectors ========= */

// All posts in feed order
export const selectAllPosts = createSelector([selectPostsState], (postsState) =>
  postsState.allIds.map((id) => postsState.byId[id]).filter(Boolean),
);

// Single post by id
export const selectPostById = createSelector(
  [selectPostsState, (_, postId) => postId],
  (postsState, postId) => {
    if (!postId) return undefined;
    return postsState.byId[String(postId)];
  },
);

// Posts by author
export const selectPostsByAuthor = createSelector(
  [selectAllPosts, (_, authorId) => authorId],
  (allPosts, authorId) => {
    if (!authorId) return [];
    return allPosts.filter((p) => p && String(p.authorId) === String(authorId));
  },
);

// Semantic Status Selectors
export const selectIsPostsLoading = createSelector(
  [selectPostsState],
  (postsState) => postsState.status === 'loading',
);

export const selectPostsError = createSelector(
  [selectPostsState],
  (postsState) => postsState.error,
);

// Pagination Selectors (Drilling into nested object)
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
