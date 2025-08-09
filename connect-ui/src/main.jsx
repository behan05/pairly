import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './styles/Theme/index';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((_) => {
        return null;
      });
  });
}

