import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Divider } from '@/MUI/MuiComponents';
import Navbar from '@/components/public/Navbar';
import Sidebar from '@/components/public/Sidebar';
import Footer from '@/components/public/Footer';
import { useSidebar } from '../context/SidebarContext';

const Layout = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const { isSidebarOpen } = useSidebar();

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100dvh',
      }}
    >
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
