import * as React from 'react';
import { Box, Stack, Typography } from '@/MUI/MuiComponents';

import {} from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import BlurWrapper from '@/components/common/BlurWrapper';
import StyledText from '@/components/common/StyledText';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CompletionAndActivity() {
  return (
    <Box component={'section'} sx={{p:2}}>
      <ToastContainer position="top-right" autoClose={1000} theme="colored" />

      {/* Header with arrow back icon */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/profile'} text={'Completion And Activity'} />
      </Stack>

      <BlurWrapper>
        {/* Heading & TagLine */}
        <Stack>
          <Typography textAlign="center" variant="h5" fontWeight={600} gutterBottom>
            Coming <StyledText text={'Soon...'} /> 🚀
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            This section will help you track your profile progress and activity in future updates.
          </Typography>
        </Stack>
      </BlurWrapper>
    </Box>
  );
}

export default CompletionAndActivity;
