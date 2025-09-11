import { Outlet } from 'react-router-dom';
import { Box } from '@/MUI/MuiComponents';

function AccountLayout() {
  return (
    <Box component={'section'}>
      <Outlet />
    </Box>
  );
}

export default AccountLayout;
