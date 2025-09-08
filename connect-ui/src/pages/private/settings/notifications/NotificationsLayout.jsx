import { Box } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';

function NotificationsLayout() {
  return (
    <Box component={'section'}>
      <Outlet />
    </Box>
  );
}

export default NotificationsLayout;
