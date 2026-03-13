// src/store/posts/posts.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {},    // postId -> post object
  allIds: [],  // list of postIds in feed order
  status: 'idle', // 'idle' | 'loading' | 'error' | 'success'
  error: null,
  
  // Grouped Metadata
  pagination: {
    page: 1,
    hasMore: true,
    initialLoaded: false,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostsStatus(state, action) {
      state.status = action.payload || 'idle';
      state.error = null;
    },
    setPostsError(state, action) {
      state.status = 'error';
      state.error = action.payload || 'Failed to load posts';
    },
    // Syncs a full list (replaces current cache)
    setPostList(state, action) {
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
      state.pagination.initialLoaded = true;
    },
    // Adds a new page of posts to the end
    appendPostPage(state, action) {
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
    // Syncs a single post object (create/update/detail)
    setPostDetail(state, action) {
      const post = action.payload;
      if (!post?.$id) return;

      const id = String(post.$id);
      const exists = !!state.byId[id];

      state.byId[id] = post;
      if (!exists) {
        state.allIds.unshift(id); // New post to top
      }
      state.status = 'success';
    },
    // Deletes a specific post record
    clearPostRecord(state, action) {
      const id = String(action.payload);
      if (!state.byId[id]) return;

      delete state.byId[id];
      state.allIds = state.allIds.filter((pid) => pid !== id);
    },
    // Updates pagination metadata
    setPostPagination(state, action) {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
  },
});

export const {
  setPostsStatus,
  setPostsError,
  setPostList,
  appendPostPage,
  setPostDetail,
  clearPostRecord,
  setPostPagination,
} = postsSlice.actions;

export default postsSlice.reducer;
