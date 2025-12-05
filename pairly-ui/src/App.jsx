import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import InstallPrompt from './installPrompt/InstallPrompt';
import { useSelector } from 'react-redux';

function App() {
  const {
    connected: isConnected,
  } = useSelector((state) => state.randomChat);
  return (
    <>
      <ToastContainer draggable position="top-right" autoClose={1000} theme="colored" />

      {/* hide when user start chating in random connect */}
      {!isConnected && <InstallPrompt />}
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
