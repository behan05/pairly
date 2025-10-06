import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  privacySettings: null,
  notificationSettings: null,
  chatSettings: null,
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
      Object.assign(state, action.payload);
    }
  }
});

export const { setLoading, setError, setSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
