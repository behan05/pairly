import { Outlet } from 'react-router-dom';
import { Box, Stack, useMediaQuery, useTheme } from '@/MUI/MuiComponents';
import Navbar from '@/components/public/Navbar';
import video from '@/assets/videos/bgVideo.mp4';
import video2 from '@/assets/videos/bgVideo2.mp4';
import Sidebar from '@/components/public/Sidebar';
import Footer from '@/components/public/Footer';
import { useSidebar } from '../context/SidebarContext';
import React from 'react';

const Layout = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const { isSidebarOpen } = useSidebar();

  const [videoChanged, setVideoChanged] = React.useState(
    localStorage.getItem('currentVideo') === 'true'
  );

  React.useEffect(() => {
    const saved = localStorage.getItem('currentVideo');
    setVideoChanged(saved === 'true');

    const handleStorageChange = () => {
      const updated = localStorage.getItem('currentVideo');
      setVideoChanged(updated === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const changedBgVideo = videoChanged ? video : video2;

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* === Background Video === */}
      <Stack
        component={'video'}
        src={changedBgVideo}
        loading="lazy"
        aria-label="background video"
        autoPlay
        muted
        loop
        playsInline
        type="video/mp4"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.14)',
          zIndex: -2
        }}
      />

      {/* === Optional Dark Overlay === */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: -1
        }}
      />

      {/* === Navbar Section === */}
      <Navbar />
      <Box
        sx={{
          px: isSm ? 0 : isMd ? 3 : 15,
          display: 'flex',
          gap: 2
        }}
      >
        {/* === Sidebar === */}
        <Box sx={{ position: 'relative' }}>{isSm ? isSidebarOpen && <Sidebar /> : <Sidebar />}</Box>
        {/* === Main Content === */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: isSm ? 2 : 5,
            py: 2,
            width: '100%'
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* === Footer === */}
      <Footer />
    </Box>
  );
};

export default Layout;
