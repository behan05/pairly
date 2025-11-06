import * as React from 'react';
import { Box, Typography } from '@/MUI/MuiComponents';
import StyledText from '@/components/common/StyledText';
import FAQ from '@/components/public/FAQ';

function FAQs() {
  React.useEffect(() => {
    document.title = 'Pairly - FAQs';
  }, []);

  return (
    <Box sx={{ p: 3, mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Frequently <StyledText text="Asked Questions" />
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        mb={4}
      >
        Get quick answers to the most common questions about Pairly.
      </Typography>

      <FAQ />
    </Box>
  );
}

export default FAQs;
