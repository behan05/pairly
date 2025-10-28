import { useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  useTheme
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { Outlet } from 'react-router-dom';
import StandupNavbar from './StandupNavbar';

const VirtualStandupHallLayout = () => {
  const theme = useTheme();

  useEffect(() => {
    document.title = 'Virtual Standup Hall'
  }, []);

  return (
    <>
      {/* Custom Navbar */}
      <StandupNavbar />

      {/* Main Layout */}
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          background: `linear-gradient(180deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
        }}
      >
        {/* Header Section */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <EventIcon sx={{ fontSize: 24, color: theme.palette.secondary.main }} />
          <Typography variant="subtitle2" fontWeight={700}>
            #World First Virtual Standup Hall 🎭
          </Typography>
        </Stack>

        {/* Dynamic nested routes content */}
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default VirtualStandupHallLayout;
