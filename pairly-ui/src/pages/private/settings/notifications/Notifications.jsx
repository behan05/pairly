import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
  Divider,
  FormControlLabel,
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
import CyberSwitch from '@/components/private/CyberSwitch';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateSettingsNotification, getSettingsNotification } from '@/redux/slices/settings/settingsAction';
import PremiumFeatureModel from '@/components/private/premium/PremiumFeatureModal';

function Notifications() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { notificationSettings } = useSelector((state) => state.settings);
  const { plan, status } = useSelector((state) => state.auth.user.subscription);

  const [modalOpen, setModalOpen] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState('');

  const [notifSettings, setNotifSettings] = useState({
    newMatch: false,
    newMessage: false,
    warningAlerts: false,
    friendRequest: false,
    blockNotification: false
  });

  // When Redux store updates, sync to local state
  useEffect(() => {
    dispatch(getSettingsNotification());
  }, []);

  useEffect(() => {
    if (notificationSettings) {
      setNotifSettings(notificationSettings);
    }
  }, [notificationSettings]);

  // Toggle handler
  const handleToggle = useCallback(
    async (key) => {

      const premiumFeatures = ['warningAlerts', 'blockNotification'];
      const isFreeUser = status === 'active' && plan === 'free';

      if (premiumFeatures.includes(key) && isFreeUser) {
        const featureNames = {
          warningAlerts: 'Safety & Alerts Notifications',
          blockNotification: 'Advanced Block Alerts'
        };

        setPremiumFeatureName(featureNames[key] || 'Premium Feature');
        setModalOpen(true);
        return;
      };

      const updated = { ...notifSettings, [key]: !notifSettings[key] };
      setNotifSettings(updated);

      const response = await dispatch(updateSettingsNotification(updated));

      if (response?.success) {
        toast.success(response.message || 'Notification settings updated', {
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
            sx={{ display: 'flex', ml: 0.2, gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                checked={notifSettings.newMatch}
                onChange={() => handleToggle('newMatch')}
                id={'newMatch'}
              />
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
            sx={{ display: 'flex', ml: 0.2, gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                checked={notifSettings.newMessage}
                onChange={() => handleToggle('newMessage')}
                id={'newMessage'}
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
            sx={{ display: 'flex', ml: 0.2, gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                checked={notifSettings.warningAlerts}
                onChange={() => handleToggle('warningAlerts')}
                id={'warningAlerts'}
              />
            }
            label="Enable safety alerts"
          />
        </Section>

        <Divider />

        <Section
          icon={<PersonAddIcon sx={{ color: theme.palette.primary.main }} />}
          title="Friend Requests"
          description="Notify when a friend request is sent or accepted."
        >
          <FormControlLabel
            sx={{ display: 'flex', ml: 0.2, gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                checked={notifSettings.friendRequest}
                onChange={() => handleToggle('friendRequest')}
                id={'friendRequest'}
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
            sx={{ display: 'flex', ml: 0.2, gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                checked={notifSettings.blockNotification}
                onChange={() => handleToggle('blockNotification')}
                id={'blockNotification'}
              />
            }
            label="Enable block notifications"
          />
        </Section>
      </BlurWrapper>

      <PremiumFeatureModel
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        featureName={premiumFeatureName}
      />
    </Box>
  );
}

export default Notifications;
