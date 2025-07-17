import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
    fetched: false, // flag to prevent re-fetching
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.fetched = true;
      state.loading = false;
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
    },
    markStale: (state) => {
      state.fetched = false;
    },
  },
});

export const { setPosts, setLoading, setError, clearPosts, markStale } =
  postsSlice.actions;
export default postsSlice.reducer;
