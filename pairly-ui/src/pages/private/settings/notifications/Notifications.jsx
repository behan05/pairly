import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  useTheme
} from '@/MUI/MuiComponents';

import {
  NotificationsActiveIcon,
  MessageIcon,
  ReportIcon,
  PersonAddIcon,
  BlockIcon
} from '@/MUI/MuiIcons';

import BlurWrapper from '@/components/common/BlurWrapper';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getSettingsNotification,
  updateSettingsNotification
} from '@/redux/slices/settings/settingsAction';

function Notifications() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { settingsData } = useSelector((state) => state.settings);
  const notificationSettings = settingsData?.notificationSettings;

  const [notifSettings, setNotifSettings] = useState({
    newMatch: false,
    newMessage: false,
    warningAlerts: false,
    friendRequest: false,
    blockNotification: false
  });

  // 1. Fetch settings from backend on mount
  useEffect(() => {
    dispatch(getSettingsNotification());
  }, [dispatch]);

  // 2. When Redux store updates, sync to local state
  useEffect(() => {
    if (notificationSettings) {
      setNotifSettings(notificationSettings);
    }
  }, [notificationSettings]);

  // 3. Toggle handler
  const handleToggle = useCallback(
    async (key) => {
      const updated = { ...notifSettings, [key]: !notifSettings[key] };
      setNotifSettings(updated);

      const response = await dispatch(updateSettingsNotification(updated));

      if (response?.success) {
        toast.success(response.message || 'Notification settings updated');
      } else {
        toast.error(response.error || 'Failed to update settings');
      }
    },
    [notifSettings, dispatch]
  );

  const Section = ({ icon, title, description, children }) => (
    <Box>
      <Stack direction="row" alignItems="center" gap={1} mb={1}>
        {icon}
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {description}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </Box>
  );

  return (
    <Box>
      <ToastContainer position="top-right" autoClose={1000} theme="colored" />

      <Stack mb={2}>
        <NavigateWithArrow redirectTo="/pairly/settings" text="Notifications" />
      </Stack>

      <BlurWrapper>
        <Section
          icon={<NotificationsActiveIcon sx={{ color: theme.palette.success.main }} />}
          title="New Match"
          description="Get notified when you get a new random match."
        >
          <FormControlLabel
            control={
              <Switch checked={notifSettings.newMatch} onChange={() => handleToggle('newMatch')} />
            }
            label="Enable match notifications"
          />
        </Section>

        <Divider />

        <Section
          icon={<MessageIcon sx={{ color: theme.palette.info.main }} />}
          title="New Message"
          description="Receive alerts when someone sends you a message."
        >
          <FormControlLabel
            control={
              <Switch
                checked={notifSettings.newMessage}
                onChange={() => handleToggle('newMessage')}
              />
            }
            label="Enable message notifications"
          />
        </Section>

        <Divider />

        <Section
          icon={<ReportIcon sx={{ color: theme.palette.warning.main }} />}
          title="Warning & Alerts"
          description="Get notified of suspicious activity or policy warnings."
        >
          <FormControlLabel
            control={
              <Switch
                checked={notifSettings.warningAlerts}
                onChange={() => handleToggle('warningAlerts')}
              />
            }
            label="Enable safety alerts"
          />
        </Section>

        <Divider />

        <Section
          icon={<PersonAddIcon sx={{ color: theme.palette.primary.main }} />}
          title="Friend Requests"
          description="Receive notifications when someone sends you a friend request."
        >
          <FormControlLabel
            control={
              <Switch
                checked={notifSettings.friendRequest}
                onChange={() => handleToggle('friendRequest')}
              />
            }
            label="Enable friend request notifications"
          />
        </Section>

        <Divider />

        <Section
          icon={<BlockIcon sx={{ color: theme.palette.error.main }} />}
          title="Block Activity"
          description="Receive alerts when a blocked user interacts or appears again."
        >
          <FormControlLabel
            control={
              <Switch
                checked={notifSettings.blockNotification}
                onChange={() => handleToggle('blockNotification')}
              />
            }
            label="Enable block notifications"
          />
        </Section>
      </BlurWrapper>
    </Box>
  );
}

export default Notifications;
