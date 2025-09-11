import { Box } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';

function ChatsLayout() {
  return (
    <Box component={'section'}>
      <Outlet />
    </Box>
  );
}

export default ChatsLayout;
