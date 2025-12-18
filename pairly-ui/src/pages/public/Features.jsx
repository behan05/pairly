import React from 'react';
import { Box, Typography, Stack, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import { StarIcon } from '@/MUI/MuiIcons';
import PairlyFeatures from '@/components/public/PairlyFeatures';
import StyledActionButton from '@/components/common/StyledActionButton';

function Features() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme.breakpoints.down('xl'));

  React.useEffect(() => {
    document.title = 'Pairly - Features';
  }, []);

  return (
    <Box
      sx={{
        my: '6dvh',
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '20%',
      }}
    >
      {/* Section Heading */}
      <Stack spacing={2} mb={4}>
        <Stack mb={6} spacing={1.5}>
          <Typography
            variant="h3"
            fontWeight={700}
            mb={3}
            sx={{ color: 'text.primary' }}
          >
            Explore Pairly’s{' '}
            <span style={{ color: theme.palette.primary.main }}>Features</span>
          </Typography>

          <Typography
            variant="body1"
            color= {`${theme.palette.text.primary}70`}
            maxWidth={700}
            lineHeight={1.7}
          >
            Pairly isn’t just another chat app it’s a revolution in how people
            connect online. Our mission is to bring back authenticity to digital
            conversations using <strong>AI-driven matching</strong>, private and safe
            communication tools, and emotionally aware interaction modes.
          </Typography>

          <Typography
            variant="body1"
            color= {`${theme.palette.text.primary}70`}
            maxWidth={700}
            lineHeight={1.7}
          >
            Every feature in Pairly is designed to make relationships whether
            friendly, romantic, or expressive feel more natural, private, and human.
            From <strong>smart pairing</strong> and <strong>silent feel mode</strong>{' '}
            to <strong>AI personalities</strong> that truly understand your mood,
            Pairly redefines what a social platform can be.
          </Typography>

          <Typography
            variant="body1"
            color= {`${theme.palette.text.primary}70`}
            maxWidth={700}
            lineHeight={1.7}
          >
            Discover the future of real connection powered by empathy, not
            algorithms.
          </Typography>

          <StyledActionButton
            text="Start Exploring"
            redirectUrl="/register"
            endIcon={<StarIcon />}
            sx={{width: 'fit-content'}}
          />
        </Stack>
      </Stack>

      {/* Features Grid */}
      <PairlyFeatures />
    </Box>
  );
}

export default Features;
