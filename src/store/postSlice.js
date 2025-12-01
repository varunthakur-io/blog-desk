// src/store/postSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  byId: {}, // postId -> post object
  allIds: [], // list of postIds in feed order

  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  initialLoaded: false,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostsLoading(state, action) {
      state.loading = action.payload;
    },

    setPostsError(state, action) {
      state.error = action.payload || null;
    },

    setPage(state, action) {
      state.page = action.payload;
    },

    setHasMore(state, action) {
      state.hasMore = action.payload;
    },

    setInitialLoaded(state, action) {
      state.initialLoaded = action.payload;
    },

    // Replace all posts (e.g. first load or refresh)
    setPosts(state, action) {
      const posts = action.payload || [];
      state.byId = {};
      state.allIds = [];

      for (const post of posts) {
        if (!post?.$id) continue;
        const id = String(post.$id);
        state.byId[id] = post;
        state.allIds.push(id);
      }
    },

    // Append / upsert a page of posts
    appendPosts(state, action) {
      const posts = action.payload || [];

      for (const post of posts) {
        if (!post?.$id) continue;
        const id = String(post.$id);
        const exists = !!state.byId[id];

        // upsert into byId
        state.byId[id] = post;

        // only push into allIds if not already present
        if (!exists) {
          state.allIds.push(id);
        }
      }
    },

    // Create/update a single post (e.g. after create/edit/detail fetch)
    upsertPost(state, action) {
      const post = action.payload;
      if (!post?.$id) return;

      const id = String(post.$id);
      const exists = !!state.byId[id];

      state.byId[id] = post;

      if (!exists) {
        // prepend new post to feed
        state.allIds.unshift(id);
      }
    },

    // Remove a post
    removePost(state, action) {
      const id = String(action.payload);
      if (!state.byId[id]) return;

      delete state.byId[id];
      state.allIds = state.allIds.filter((pid) => pid !== id);
    },

    // Optional: global search term (if you ever use it in navbar again)
    setSearchTerm(state, action) {
      state.searchTerm = action.payload || '';
    },
  },
});

export const {
  setPostsLoading,
  setPostsError,
  setPage,
  setHasMore,
  setInitialLoaded,
  setPosts,
  appendPosts,
  upsertPost,
  removePost,
  setSearchTerm,
} = postsSlice.actions;

export default postsSlice.reducer;

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
