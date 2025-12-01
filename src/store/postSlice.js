// src/store/postsSlice.js
import { createSlice } from '@reduxjs/toolkit';

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

    // Append posts (for pagination)
    appendPosts(state, action) {
      const posts = action.payload || [];

      for (const post of posts) {
        if (!post?.$id) continue; // ✅ fixed condition
        const id = String(post.$id);

        state.byId[id] = post;

        if (!state.allIds.includes(id)) {
          // ✅ keep ordering
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
        state.allIds.unshift(id); // prepend new post to list
      }
    },

    // Remove a post
    removePost(state, action) {
      const id = String(action.payload);
      if (!state.byId[id]) return;

      delete state.byId[id];
      state.allIds = state.allIds.filter((pid) => pid !== id);
    },

    // TODO: implement or remove if unused
    setSearchTerm(state, action) {
      // left empty for now
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

/* ========= Selectors ========= */

export const selectAllPosts = (state) =>
  state.posts.allIds.map((id) => state.posts.byId[id]).filter(Boolean);

export const selectPostById = (state, postId) =>
  postId ? state.posts.byId[String(postId)] : undefined;

export const selectPostsByAuthor = (state, authorId) => {
  if (!authorId) return [];
  return selectAllPosts(state).filter(
    (p) => String(p.authorId) === String(authorId),
  );
};

export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectPage = (state) => state.posts.page;
export const selectHasMore = (state) => state.posts.hasMore;
export const selectInitialLoaded = (state) => state.posts.initialLoaded;
