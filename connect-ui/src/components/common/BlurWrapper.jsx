import React from 'react';
import { Box, useTheme } from '@/MUI/MuiComponents';

const BlurWrapper = ({ children, component = 'div', onSubmit, sx = {}, ...rest }) => {
  const theme = useTheme();

  return (
    <Box
      component={component}
      onSubmit={onSubmit}
      mt={4}
      display="flex"
      flexDirection="column"
      gap={4}
      maxWidth={800}
      minWidth={300}
      mx="auto"
      px={2}
      py={3}
      borderRadius={1}
      sx={{
        backdropFilter: 'blur(14px)',
        backgroundColor: 'inherit',
        boxShadow: `inset 1px 1px 0.2rem ${theme.palette.divider}`,
        ...sx
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default BlurWrapper;
