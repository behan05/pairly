import { Outlet } from 'react-router-dom';
import { Box } from '@/MUI/MuiComponents';

function ProfileLayout() {
  return (
    <Box
      component={'section'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto'
      }}
    >
      <Outlet />
    </Box>
  );
}

export default ProfileLayout;
