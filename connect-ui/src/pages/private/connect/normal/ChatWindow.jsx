import React from 'react';
import { Box, Stack, Typography, IconButton, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatHeader from './ChatHeader';

const ChatWindow = ({ selectedUserId, onBack }) => {
  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      sx={{
        maxHeight: '100vh',
        minHeight: '100vh',
        bgcolor: 'background.paper'
      }}
    >
      {/* Optional Back Button only for small screens */}
      {isTabletOrBelow && (
        <Stack direction="row" alignItems="center" p={1}>
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" ml={1}>
            Chat
          </Typography>
        </Stack>
      )}

      {/* Chat header */}
      <ChatHeader userId={selectedUserId} />

      {/* TODO: Add message list and input components here */}
    </Box>
  );
};

export default ChatWindow;
