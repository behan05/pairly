import React from 'react';
import { Box, Typography, Stack, useTheme } from '@/MUI/MuiComponents';
import PairlyFeatures from '@/components/public/PairlyFeatures';
import StyledText from '@/components/common/StyledText';
import SparkleIcon from '@mui/icons-material/AutoAwesome';

function Features() {
  const theme = useTheme();

  React.useEffect(() => {
    document.title = 'Pairly - Features';
  }, []);

  return (
    <Box>
      {/* Section Heading */}
      <Stack spacing={2} textAlign="center" mb={6}>
        <Stack alignItems="center" mb={6} textAlign="center" spacing={1.5}>
          <Typography
            variant="h5"
            fontWeight={700}
            letterSpacing={1}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <SparkleIcon sx={{ color: theme.palette.warning.main }} />
            Explore Our <Typography
              component="span"
              sx={{
                background: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              <StyledText text='Next-Gen Chat' />
            </Typography>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            maxWidth={700}
            lineHeight={1.7}
          >
            Pairly isn’t just another chat app — it’s a leap forward.
            Powered by AI, privacy-first architecture, and real human connection.
          </Typography>
        </Stack>
      </Stack>

      {/* Features Grid */}
      <PairlyFeatures />
    </Box>
  );
}

export default Features;
