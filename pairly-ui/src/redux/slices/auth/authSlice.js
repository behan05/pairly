import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authProvider: 'local'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload?.user;
      state.token = action.payload?.token;
      state.authProvider = action?.payload?.authProvider;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user.subscription = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  }
});
export const { setError, setLoading, setUser, logout, updateUser } = authSlice?.actions;
export default authSlice.reducer;
