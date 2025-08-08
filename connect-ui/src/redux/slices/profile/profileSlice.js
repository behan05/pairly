import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  profileData: null,
  loading: false,
  error: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    setProfileData: (state, action) => {
      state.profileData = action.payload;
      state.error = null;
      state.loading = false;
    }
  }
});

export const { setLoading, setError, setProfileData } = profileSlice.actions;
export default profileSlice.reducer;
