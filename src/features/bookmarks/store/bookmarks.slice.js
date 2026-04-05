import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // array of bookmarked post objects
  ids: [],   // array of bookmarked post IDs for quick lookup
  status: 'idle', // idle | loading | success | error
  error: null,
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setBookmarks(state, action) {
      state.items = action.payload || [];
      state.ids = state.items.map(post => post.$id);
      state.status = 'success';
    },
    addBookmark(state, action) {
      const post = action.payload;
      if (!state.ids.includes(post.$id)) {
        state.items.unshift(post);
        state.ids.push(post.$id);
      }
    },
    removeBookmark(state, action) {
      const postId = action.payload;
      state.items = state.items.filter(post => post.$id !== postId);
      state.ids = state.ids.filter(id => id !== postId);
    },
    setBookmarksStatus(state, action) {
      state.status = action.payload;
    },
    setBookmarksError(state, action) {
      state.status = 'error';
      state.error = action.payload;
    },
    resetBookmarks(state) {
      return initialState;
    }
  },
});

export const {
  setBookmarks,
  addBookmark,
  removeBookmark,
  setBookmarksStatus,
  setBookmarksError,
  resetBookmarks
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
