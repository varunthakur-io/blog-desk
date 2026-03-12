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

// Simple scalar selectors (no referential problems)
export const selectPostsLoading = (state) => selectPostsState(state).loading;
export const selectPostsError = (state) => selectPostsState(state).error;
export const selectPage = (state) => selectPostsState(state).page;
export const selectHasMore = (state) => selectPostsState(state).hasMore;
export const selectInitialLoaded = (state) =>
  selectPostsState(state).initialLoaded;
export const selectPostsSearchTerm = (state) =>
  selectPostsState(state).searchTerm;
