import { createSlice } from "@reduxjs/toolkit";

// Check localStorage, fallback to "dark"
const savedTheme = localStorage.getItem("theme") || "dark";

const initialState = {
  themeMode: savedTheme,
  eroticMode: false
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.themeMode === "light" ? "dark" : "light";
      state.themeMode = newTheme;
      localStorage.setItem("theme", newTheme);
    },

    toggleEroticMode: (state) => {
      state.eroticMode = !state.eroticMode
    },

    resetEroticMode: (state) => {
      state.eroticMode = false
    },
  },
});

export const { toggleTheme, toggleEroticMode, resetEroticMode } = themeSlice.actions;
export default themeSlice.reducer;
