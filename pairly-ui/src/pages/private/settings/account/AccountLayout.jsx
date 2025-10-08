import { Outlet } from 'react-router-dom';
import { Box } from '@/MUI/MuiComponents';

function AccountLayout() {
  return (
    <Box component={'section'} sx={{p: 2,}}>
      <Outlet />
    </Box>
  );
}

export default AccountLayout;
