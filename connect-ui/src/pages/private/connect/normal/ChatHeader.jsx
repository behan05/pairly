import React from 'react';
import { Box, Avatar, Typography, Stack, Divider } from '@/MUI/MuiComponents';
import { chatPartners } from './mockData';

function ChatHeader({ userId }) {
  const user = chatPartners.find((u) => String(u.id) === String(userId));

  if (!user) {
    return (
      <Box p={2}>
        <Typography variant="body1" color="text.secondary">
          No user selected
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>
    );
  }

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <Box p={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar src={user.avatar} alt={user.name} />
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {capitalize(user.status)}
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export default ChatHeader;
