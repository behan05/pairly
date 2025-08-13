import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import Initialising from './Initialising/Initialising';
import { routes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import InstallPrompt from './installPrompt/InstallPrompt';

function App() {
  const [initialising, setinitialising] = useState(true);

  useEffect(() => {
    setTimeout(() => setinitialising(false), 2500);
  }, []);

  return (
    <>
      <ToastContainer draggable position="top-right" autoClose={1000} theme="colored" />
      <InstallPrompt />
      {initialising ? <Initialising /> : <RouterProvider router={routes} />}
    </>
  );
}

export default App;
