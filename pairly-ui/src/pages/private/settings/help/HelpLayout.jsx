import { Box } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';

function HelpLayout() {
  return (
    <Box component={'section'}>
      <Outlet />
    </Box>
  );
}

export default HelpLayout;
