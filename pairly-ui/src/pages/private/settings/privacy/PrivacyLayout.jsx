import { Box } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';

function PrivacyLayout() {
  return (
    <Box component={'section'}>
      <Outlet />
    </Box>
  );
}

export default PrivacyLayout;
