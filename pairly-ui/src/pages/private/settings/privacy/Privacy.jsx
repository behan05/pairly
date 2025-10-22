import { useEffect, useState } from 'react';
import { Box, Stack, useTheme, Typography, Divider, FormControlLabel } from '@/MUI/MuiComponents';
import {
  VisibilityIcon,
  TuneIcon,
  BlockIcon,
  ChatIcon,
  SettingsBackupRestoreIcon
} from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import BlurWrapper from '@/components/common/BlurWrapper';
import CyberSwitch from '@/components/private/CyberSwitch';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PremiumFeatureModel from '@/components/private/premium/PremiumFeatureModal';

import { updateSettingsPrivacy, getSettingsPrivacy } from '@/redux/slices/settings/settingsAction';
import { useSelector, useDispatch } from 'react-redux';

function Privacy() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { privacySettings } = useSelector((state) => state.settings);
  const { plan, status } = useSelector((state) => state.auth.user.subscription);
  const [modalOpen, setModalOpen] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState('');

  const defaultSettings = {
    showProfilePic: true,
    showLocation: true,
    matchVerifiedOnly: false,
    allowRechat: true,
    blockNSFW: true,
    autoDeleteChats: false,
    allowExportData: false
  };

  const [formData, setFormData] = useState(defaultSettings);

  useEffect(() => {
    dispatch(getSettingsPrivacy());
  }, []);

  // Sync Redux state for Local form state
  useEffect(() => {
    if (privacySettings) {
      setFormData(privacySettings)
    }
  }, [privacySettings]);

  const handleToggle = (key) => async (e) => {
    const updatedValue = e.target.checked;

    const premiumFeatures = ['matchVerifiedOnly', 'allowExportData', 'autoDeleteChats'];
    const isFreeUser = status === 'active' && plan === 'free';

    if (premiumFeatures.includes(key) && isFreeUser) {
      setPremiumFeatureName(key === 'autoDeleteChats'
        ? 'Auto-delete chats'
        : key === 'matchVerifiedOnly' ? 'Match with verified users only'
          : key === 'allowExportData' ? '' : 'Export my data');
      setModalOpen(true);
      return;
    };

    const updatedFormData = {
      ...formData,
      [key]: updatedValue
    };

    setFormData(updatedFormData);

    try {
      const response = await dispatch(updateSettingsPrivacy(updatedFormData));

      if (response?.success) {
        toast.success(response.message || 'Privacy settings updated', {
          style: {
            backdropFilter: 'blur(14px)',
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }
        });
      } else {
        toast.error(response?.error || response?.message || 'Failed to update settings', {
          style: {
            backdropFilter: 'blur(14px)',
            background: theme.palette.warning.main,
            color: theme.palette.text.primary,
          }
        });
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong', {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.warning.main,
          color: theme.palette.text.primary,
        }
      });
    }
  };

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

      {/* Navigation Back */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo="/pairly/settings" text="Privacy Settings" />
      </Stack>

      <BlurWrapper>
        {/* === Sections === */}
        <Section
          icon={<VisibilityIcon fontSize="small" sx={{ color: 'info.main' }} />}
          title="Profile Visibility"
          description="Control whether your profile picture or location is visible during a chat."
        >
          <FormControlLabel
            sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                id="showProfilePic"
                checked={formData.showProfilePic}
                onChange={handleToggle('showProfilePic')}
              />
            }
            label="Show profile image in private chat"
          />
          <FormControlLabel
            sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                id="showLocation"
                checked={formData.showLocation}
                onChange={handleToggle('showLocation')}
              />
            }
            label="Show location in private chat"
          />
        </Section>

        <Divider />

        <Section
          icon={<TuneIcon fontSize="small" sx={{ color: 'primary.main' }} />}
          title="Matching Preferences"
          description="Choose who you're matched with during random chats."
        >
          <FormControlLabel
            sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                id="matchVerifiedOnly"
                checked={formData.matchVerifiedOnly}
                onChange={handleToggle('matchVerifiedOnly')}
              />
            }
            label="Match with verified users only"
          />
        </Section>

        <Divider />

        <Section
          icon={<ChatIcon fontSize="small" sx={{ color: 'success.main' }} />}
          title="Chat Preferences"
          description="Decide how chats behave like rechat and auto-deletion."
        >
          <FormControlLabel
            sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                id="allowRechat"
                checked={formData.allowRechat}
                onChange={handleToggle('allowRechat')}
              />
            }
            label="Allow user to reconnect after chat"
          />
          <FormControlLabel
            sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                checked={formData.autoDeleteChats}
                onChange={handleToggle('autoDeleteChats')}
                id="autoDeleteChats"
              />
            }
            label="Auto delete chats after session"
          />
        </Section>

        <Divider />

        <Section
          icon={<BlockIcon fontSize="small" sx={{ color: 'error.main' }} />}
          title="Safety & NSFW"
          description="Improve your safety by blocking inappropriate matches."
        >
          <FormControlLabel
            sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                checked={formData.blockNSFW}
                onChange={handleToggle('blockNSFW')}
                id="blockNSFW"
              />
            }
            label="Block NSFW matches"
          />
        </Section>

        <Divider />

        <Section
          icon={<SettingsBackupRestoreIcon fontSize="small" sx={{ color: 'warning.main' }} />}
          title="Data & Logs"
          description="Choose if your chat data can be exported or saved."
        >
          <FormControlLabel
            sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            control={
              <CyberSwitch
                checked={formData.allowExportData}
                onChange={handleToggle('allowExportData')}
                id="allowExportData"
              />
            }
            label="Allow export of my data"
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

export default Privacy;
