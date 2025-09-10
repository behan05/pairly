import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import getTheme from "./styles/Theme/index";
import App from "./App";
import { store } from "./redux/store";
import { Provider, useSelector } from "react-redux";
import { useMemo } from "react";

// A wrapper component for theme handling
function ThemeWrapper() {
  const mode = useSelector((state) => state.theme.themeMode);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeWrapper />
  </Provider>
);

// Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch(() => null);
  });
}
