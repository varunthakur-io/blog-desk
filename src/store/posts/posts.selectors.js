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

// Simple scalar selectors
export const selectPage = (state) => selectPostsState(state).page;
export const selectHasMore = (state) => selectPostsState(state).hasMore;
export const selectInitialLoaded = (state) =>
  selectPostsState(state).initialLoaded;
