import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Divider } from '@/MUI/MuiComponents';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

const Layout = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        background: theme.palette.background.paper
      }}
    >
      {/* === Navbar Section === */}
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          gap: 2
        }}
      >

        {/* === Main Content === */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: isSm ? 4 : 5,
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
