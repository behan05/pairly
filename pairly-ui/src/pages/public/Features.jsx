import React from 'react';
import { Box, Typography, Stack, useTheme } from '@/MUI/MuiComponents';
import PairlyFeatures from '@/components/public/PairlyFeatures';
import StyledText from '@/components/common/StyledText';

function Features() {
  const theme = useTheme();

  React.useEffect(() => {
    document.title = 'Pairly - Features';
  }, []);

  return (
    <Box>
      {/* Section Heading */}
      <Stack spacing={2} textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight="bold">
          Explore Our {<StyledText text="Features" />}
        </Typography>

        <Box display="flex" justifyContent="center">
          <Typography
            variant="body2"
            component="section"
            maxWidth="600px"
            textAlign="center"
            sx={{
              color: theme.palette.text.secondary
            }}
          >
            Discover how our platform helps you connect meaningfully with others. From intelligent
            matching to real-time messaging and profile customization, we've built everything to
            make your experience seamless and secure.
          </Typography>
        </Box>
      </Stack>

      {/* Features Grid */}
      <PairlyFeatures />
    </Box>
  );
}

export default Features;
