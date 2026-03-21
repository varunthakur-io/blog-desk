import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {}, // postId -> post object
  allIds: [], // array of postIds in order
  status: 'idle', // idle | loading | error | success
  error: null,

  // Grouped Metadata for feed control
  pagination: {
    page: 1,
    hasMore: true,
    initialLoaded: false,
  },

  // Active category filter for the home feed (null = all)
  activeCategory: null,
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
    // Syncs a full list (replaces current feed)
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
    // Adds a new page of results
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
        state.allIds.unshift(id);
      }
      state.status = 'success';
    },
    // Removes a post from local cache
    clearPostRecord(state, action) {
      const id = String(action.payload);
      if (!state.byId[id]) return;

      delete state.byId[id];
      state.allIds = state.allIds.filter((pid) => pid !== id);
    },
    // Updates pagination state
    setPostPagination(state, action) {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    // Sets the active category filter; resets pagination so a fresh fetch fires
    setActiveCategory(state, action) {
      state.activeCategory = action.payload ?? null;
      state.byId = {};
      state.allIds = [];
      state.pagination = { page: 1, hasMore: true, initialLoaded: false };
      state.status = 'idle';
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
  setActiveCategory,
} = postsSlice.actions;

export default postsSlice.reducer;
