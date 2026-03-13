// src/store/posts/posts.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {},    // postId -> post object
  allIds: [],  // list of postIds in feed order
  status: 'idle', // 'idle' | 'loading' | 'error' | 'success'
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
      state.status = action.payload ? 'loading' : state.status;
      state.error = null;
    },
    setPostsError(state, action) {
      state.status = 'error';
      state.error = action.payload || 'Failed to load posts';
    },
    // Replace current list with fresh data
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
      state.status = 'success';
      state.initialLoaded = true;
    },
    // Add page to existing list
    appendPosts(state, action) {
      const posts = action.payload || [];

      for (const post of posts) {
        if (!post?.$id) continue;
        const id = String(post.$id);
        const exists = !!state.byId[id];

        state.byId[id] = post;
        if (!exists) {
          state.allIds.push(id);
        }
      }
      state.status = 'success';
    },
    // Update or create single post
    setPost(state, action) {
      const post = action.payload;
      if (!post?.$id) return;

      const id = String(post.$id);
      const exists = !!state.byId[id];

      state.byId[id] = post;
      if (!exists) {
        state.allIds.unshift(id);
      }
      state.status = 'success';
    },
    // Remove post from list
    clearPost(state, action) {
      const id = String(action.payload);
      if (!state.byId[id]) return;

      delete state.byId[id];
      state.allIds = state.allIds.filter((pid) => pid !== id);
    },
    // Control pagination and flags
    setPagination(state, action) {
      const { page, hasMore } = action.payload;
      if (page !== undefined) state.page = page;
      if (hasMore !== undefined) state.hasMore = hasMore;
    },
    setInitialLoaded(state, action) {
      state.initialLoaded = !!action.payload;
    }
  },
});

export const {
  setPostsLoading,
  setPostsError,
  setPosts,
  appendPosts,
  setPost,
  clearPost,
  setPagination,
  setInitialLoaded,
} = postsSlice.actions;

export default postsSlice.reducer;
