import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  settingsData: null,
  loading: false,
  error: null
};

const settingsSlice = createSlice({
  name: 'settings',
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

    setSetting: (state, action) => {
      state.loading = false;
      state.error = null;
      state.settingsData = action.payload;
    }
  }
});

export const { setLoading, setError, setSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
