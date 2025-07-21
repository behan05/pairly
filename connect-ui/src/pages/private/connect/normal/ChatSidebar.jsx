import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@/MUI/MuiComponents';

import ChatSidebarHeader from '@/components/private/ChatSidebarHeader';
import { chatPartners } from './mockData';
import SettingsAction from '@/components/private/SettingsAction';

const ChatSidebar = ({ onUserSelect }) => {
  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      bgcolor="background.paper"
      minWidth={300}
      px={2}
      sx={{
        minHeight: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto',
      }}
    >
      <ChatSidebarHeader />

      <List disablePadding>
        {chatPartners.map((user) => (
          <ListItemButton
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            sx={{
              borderRadius: 1
            }}
          >
            <ListItemAvatar>
              <Avatar src={user.avatar} alt={user.name} />
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Floating Settings icon at bottom of sidebar */}
      <SettingsAction />
    </Box>
  );
};

export default ChatSidebar;