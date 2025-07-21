import React from 'react';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '../../../../MUI/MuiComponents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function RandomChatWindow() {

  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        maxHeight: '100vh',
        minHeight: '100vh',
        bgcolor: 'background.paper',
      }}
    >

      {/* Chat header */}
      <Typography
        variant="h6"
        fontWeight={500}
        gutterBottom
        textAlign="center"
        letterSpacing={2}
        lineHeight={1.5}
        color='text.secondary'
      >
        Hey there! 👋 <br/>🚧 We're currently building the Random Chat feature from scratch. <br />
        As a small team, we really appreciate your patience and support while we bring this to life!
      </Typography>


      {/* TODO: Add message list and input components here */}
    </Box>
  );

}

export default RandomChatWindow;