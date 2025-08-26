import { useState } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Stack,
} from '../../../../../MUI/MuiComponents';
import {

} from '../../../../../MUI/MuiIcons';

// components
import PrivateChatHeader from './PrivateChatHeader';
import PrivateMessageInput from './PrivateMessageInput';

// local state
import { useSelector } from "react-redux";

function PrivateChatWindow({
  selectedUserId,
  onBack,
  onCloseChatWindow,
  clearActiveChat
}) {
  const theme = useTheme();

  return (
    <Box
      height="100%"
      width={'100%'}
      sx={{
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* Chat Header */}
      <PrivateChatHeader
        userId={selectedUserId}
        onBack={onBack}
        onCloseChatWindow={onCloseChatWindow}
        clearActiveChat={clearActiveChat}
      />

      {/* Main Content Area */}
      <Box
        flex={1}
        p={2}
        sx={{
          overflowY: 'auto',
          maxHeight: `calc(100vh - 160px)`
        }}
      >
        {/* TODO: Replace with messages list */}
        PrivateChatWindow
      </Box>

      {/* Input Area */}
      <PrivateMessageInput />
    </Box>
  );
}

export default PrivateChatWindow;
