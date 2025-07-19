import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  status: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = true;
    },
    clearUser(state) {
      state.user = null;
      state.status = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
