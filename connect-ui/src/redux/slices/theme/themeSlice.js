import { createSlice } from "@reduxjs/toolkit";

// Check localStorage, fallback to "dark"
const savedTheme = localStorage.getItem("theme") || "dark";

const initialState = {
  themeMode: savedTheme,
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
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
