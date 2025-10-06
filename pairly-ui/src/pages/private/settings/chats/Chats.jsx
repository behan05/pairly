import React, { useEffect } from 'react';
import {
  Box,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  Select,
  MenuItem,
  useTheme
} from '@/MUI/MuiComponents';
import {
  EditNoteIcon,
  KeyboardReturnIcon,
  Brightness4Icon,
  TextFieldsIcon,
  VisibilityIcon,
  NotificationsActiveIcon,
  AccessTimeIcon
} from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import BlurWrapper from '@/components/common/BlurWrapper';
import CyberSwitch from '@/components/private/CyberSwitch';
import { toggleTheme } from '@/redux/slices/theme/themeSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getChatSettings, updateChatSettings } from '@/redux/slices/settings/settingsAction';

function Chats() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { chatSettings } = useSelector((state) => state.settings);

  const [formData, setFormData] = React.useState({
    messageSound: true,
    showTypingStatus: true,
    showOnlineStatus: true,
    showLastSeen: true,
    enterToSend: true,
    chatTheme: localStorage.getItem('theme') ?? 'dark',
    chatFontSize: 'medium'
  });

  useEffect(() => {
    dispatch(getChatSettings());
  }, []);

  useEffect(() => {
    if (chatSettings) {
      setFormData(chatSettings);
    }
  }, [chatSettings]);

  const handleChange = async (key, value) => {

    if (key === 'chatTheme') {
      localStorage.setItem('theme', value);
      dispatch(toggleTheme())
    };

    const updated = { ...formData, [key]: value };
    setFormData(updated);

    // Dispatch update action
    const response = await dispatch(updateChatSettings(updated));
    if (response?.success) {
      toast.success(response.message || 'Chat settings updated', {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }
      });
    } else {
      toast.error(response.error || 'Failed to update settings', {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.warning.main,
          color: theme.palette.text.primary,
        }
      });
    }
  };

  // Helper functions to generate UI components
  const getSwitch = (label, switchLabelText) => (
    <FormControlLabel
      sx={{ display: 'flex', ml: 0.2, gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
      control={
        <CyberSwitch
          checked={formData[label]}
          onChange={(e) => handleChange(label, e.target.checked)}
          id={label}
        />
      }
      label={switchLabelText}
    />
  );

  // Helper function to generate select dropdown
  const getSelect = (label, options) => (
    <Select
      value={formData[label]}
      onChange={(e) => handleChange(label, e.target.value)}
      size="small"
    >
      {options.map((opt) => (
        <MenuItem key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </MenuItem>
      ))}
    </Select>
  );

  const chatsItem = [
    {
      label: 'messageSound',
      icon: <NotificationsActiveIcon sx={{ color: 'success.main' }} />,
      title: 'Message Sound',
      description: 'Play a sound when a new message arrives.',
      children: getSwitch('messageSound', 'Enable message sound')
    },
    {
      label: 'showTypingStatus',
      icon: <EditNoteIcon sx={{ color: 'info.main' }} />,
      title: 'Typing Indicator',
      description: 'Show when you are typing in a chat.',
      children: getSwitch('showTypingStatus', 'Show typing indicator')
    },
    {
      label: 'showOnlineStatus',
      icon: <VisibilityIcon sx={{ color: 'text.success' }} />,
      title: 'Online Status',
      description: 'Display your online presence to others.',
      children: getSwitch('showOnlineStatus', 'Show online status')
    },
    {
      label: 'showLastSeen',
      icon: <AccessTimeIcon sx={{ color: 'secondary.main' }} />,
      title: 'Last Seen',
      description: 'Display your Last Seen to others.',
      children: getSwitch('showLastSeen', 'Show Last Seen status')
    },
    {
      label: 'enterToSend',
      icon: <KeyboardReturnIcon sx={{ color: 'primary.main' }} />,
      title: 'Enter to Send',
      description: 'Press "Enter" to send messages.',
      children: getSwitch('enterToSend', 'Use Enter to send message')
    },
    {
      label: 'chatTheme',
      icon: <Brightness4Icon sx={{ color: 'purple' }} />,
      title: 'Chat Theme',
      description: 'Toggle between light and dark chat themes.',
      children: getSelect('chatTheme', ['light', 'dark'])
    },
    {
      label: 'chatFontSize',
      icon: <TextFieldsIcon sx={{ color: 'orange' }} />,
      title: 'Font Size',
      description: 'Choose your preferred chat font size.',
      children: getSelect('chatFontSize', ['small', 'medium', 'large'])
    }
  ];

  return (
    <Box>
      <ToastContainer position="top-right" autoClose={1000} theme="colored" />

      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/settings'} text={'Chats'} />
      </Stack>
      <BlurWrapper>
        {chatsItem.map((item, i) => (
          <Box key={i}>
            <Stack direction="row" alignItems="center" gap={1} mb={1}>
              {item.icon}
              <Typography variant="h6" fontWeight={600}>
                {item.title}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {item.description}
            </Typography>
            <Stack>{item.children}</Stack>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
      </BlurWrapper>
    </Box>
  );
}

export default Chats;
