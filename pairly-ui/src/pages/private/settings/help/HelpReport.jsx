import React from 'react';
import { Box, Stack } from '@/MUI/MuiComponents';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import ReportBug from '@/components/common/ReportBug';

function HelpReport() {
  React.useEffect(() => {
    document.title = 'Pairly - Report Problem';
  }, []);

  return (
    <Box>
      {/* Header with arrow back icon */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/settings/help'} text={'Report Problem'} />
      </Stack>

      {/* === Calling Report Bug Component from commom component === */}
      <ReportBug />
    </Box>
  );
}

export default HelpReport;
