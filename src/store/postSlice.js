import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  loading: false,
  error: null,
  fetched: false,
  searchTerm: '',
  page: 1,
  limit: 6,
  hasMore: true,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Set posts for the first page
    setPosts: (state, action) => {
      const posts = Array.isArray(action.payload)
        ? action.payload
        : (action.payload?.documents ?? []);

      state.posts = posts;
      state.fetched = true;
      state.loading = false;
      state.page = 1;

      // If we got fewer than limit posts, no more pages left
      state.hasMore = posts.length === state.limit;
    },

    // Add posts for subsequent pages
    addPosts: (state, action) => {
      const newPosts = Array.isArray(action.payload)
        ? action.payload
        : (action.payload?.documents ?? []);

      state.posts = [...state.posts, ...newPosts];
      state.page += 1;
      state.loading = false;

      // If we got fewer than limit posts, stop loading further
      state.hasMore = newPosts.length === state.limit;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearPosts: (state) => {
      state.posts = [];
      state.fetched = false;
      state.page = 1;
      state.hasMore = true;
    },

    markStale: (state) => {
      state.fetched = false;
    },
  },
});

export const {
  setPosts,
  addPosts,
  setLoading,
  setError,
  clearPosts,
  markStale,
  setSearchTerm,
} = postsSlice.actions;

export default postsSlice.reducer;
