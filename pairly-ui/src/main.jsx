import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import getTheme from "./styles/Theme/index";
import App from "./App";
import { store, persistor } from "./redux/store";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useMemo, useEffect } from "react";

// A wrapper component for theme handling
function ThemeWrapper() {
  const mode = useSelector((state) => state.theme.themeMode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    const setVh = () => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    };

    setVh();
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setVh);
      window.visualViewport.addEventListener('scroll', setVh);
    } else {
      window.addEventListener('resize', setVh);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setVh);
        window.visualViewport.removeEventListener('scroll', setVh);
      } else {
        window.removeEventListener('resize', setVh);
      }
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* Add PersistGate to persist Redux state (auth.user stays saved) */}
    <PersistGate loading={null} persistor={persistor}>
      <ThemeWrapper />
    </PersistGate>
  </Provider>
);

// Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            window.location.reload();
          }
        });
      });

      // skip waiting for users to refresh manually
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    });
  });
}
