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
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        maxHeight: 'calc(var(--vh, 1vh) * 100)',
        overflowY: 'auto'
      }}
    >
      <Outlet />
    </Box>
  );
}

export default ProfileLayout;
