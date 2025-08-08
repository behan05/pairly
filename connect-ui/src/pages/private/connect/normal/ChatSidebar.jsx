import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField
} from '@/MUI/MuiComponents';
import { SearchIcon } from '@/MUI/MuiIcons';
import ChatSidebarHeader from '@/features/chat/common/ChatSidebarHeader';
import { chatPartners } from './mockData';
import SettingsAction from '@/components/private/SettingsAction';

const ChatSidebar = ({ onUserSelect }) => {
  const [searchValue, setSearchValue] = React.useState('');
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
        overflowY: 'auto'
      }}
    >
      <ChatSidebarHeader>
        {/* Search Bar */}
        <Box mt={1}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search settings..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
            }}
          />
        </Box>
      </ChatSidebarHeader>

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
