import { Box } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';

function HelpLayout() {
  return (
    <Box component={'section'} sx={{p: 2,}}>
      <Outlet />
    </Box>
  );
}

export default HelpLayout;
