import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import InstallPrompt from './installPrompt/InstallPrompt';

function App() {
  return (
    <>
      <ToastContainer draggable position="top-right" autoClose={1000} theme="colored" />
      <InstallPrompt />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
