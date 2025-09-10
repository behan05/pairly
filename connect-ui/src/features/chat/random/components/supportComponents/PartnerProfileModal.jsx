import { useMemo, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
} from '@/MUI/MuiComponents';
import {
  ArrowBackIcon,
  CloseIcon,
  SendIcon,
  PersonIcon,
  InfoOutlinedIcon,
  PsychologyOutlinedIcon,
  LocalOfferOutlinedIcon,
  LockPersonOutlinedIcon,
  defaultAvatar,
  GraphicEqIcon,
  LocationOnOutlinedIcon,
  WcOutlinedIcon,
  RecordVoiceOverOutlinedIcon,
  SubjectOutlinedIcon,
  InterestsOutlinedIcon,
  ForumOutlinedIcon,
  Diversity3OutlinedIcon,
  TranslateOutlinedIcon
} from '@/MUI/MuiIcons';

// components
import BlurWrapper from '@/components/common/BlurWrapper';
import StyledText from '@/components/common/StyledText';

// Redux
import { useSelector } from 'react-redux';

// Country and State utilities
import { Country, State } from 'country-state-city';

// custom textFormatting.
import toCapitalCase from '@/utils/textFormatting';
// socket instance
import { socket } from '@/services/socket'
/**
 * PartnerProfileModal Component
 *
 * Displays the detailed profile of a connected partner during a random chat.
 * Shows general info, interests, and a button to request private chat.
 *
 * @param {Boolean} open - Controls visibility of the modal
 * @param {Function} onClose - Callback to close the modal
 * @param {Object} partner - Partner's profile data
 * @param {JSX.Element}
 */

function PartnerProfileModal({ open, onClose, partner }) {
  // Theme and responsive check
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  // Local state
  const [activeSection, setActiveSection] = useState('general');
  const [requestingPrivateChat, setRequestingPrivateChat] = useState(false);

  // Current user's profile data from Redux store
  const { profileData } = useSelector((state) => state.profile);

  // Close modal handler
  const handleProfileClose = () => {
    onClose();
  };

  // Switch between section tabs
  const handleClick = (target) => {
    setActiveSection(target);
  };

  // Split partner name for display
  const splitPartnerFullName = partner.fullName?.split(' ');

  // Get full state name from code
  const fullStateName = useMemo(() => {
    return partner?.location?.state
      ? State.getStateByCodeAndCountry(partner.location.state, partner.location.country)?.name
      : '';
  }, [partner]);

  // Get full country name from code
  const fullCountryName = useMemo(() => {
    return partner?.location?.country
      ? Country.getCountryByCode(partner.location.country)?.name
      : '';
  }, [partner]);

  // Shared styles for displaying key-value pairs
  const detailsStyles = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-Start',
    alignItems: 'center',
    gap: 1,
    mb: 1,
    flexWrap: 'wrap'
  };

  // General info to display in "General" tab
  const generalInfo = [
    {
      label: 'Name',
      value: partner?.fullName || 'Unknown',
      icon: <PersonIcon fontSize="small" color="primary" />
    },
    {
      label: 'Age',
      value: partner?.age || 'Unknown',
      icon: <InfoOutlinedIcon fontSize="small" color="info" />
    },
    {
      label: 'Location',
      value: `${fullStateName} ${fullCountryName}` || 'Unknown',
      icon: <LocationOnOutlinedIcon fontSize="small" color="success" />
    },
    {
      label: 'Gender',
      value: toCapitalCase(partner?.gender) || 'Unknown',
      icon: <WcOutlinedIcon fontSize="small" color="secondary" />
    },
    {
      label: 'Pronouns',
      value: toCapitalCase(partner?.pronouns) || 'Unknown',
      icon: <RecordVoiceOverOutlinedIcon fontSize="small" color="warning" />
    },
    {
      label: 'Bio',
      value: partner?.bio || 'No bio available',
      icon: <SubjectOutlinedIcon fontSize="small" color="action" />
    }
  ];

  // Interests and chat preferences to show in "Interests" tab
  const partnerInterests = [
    {
      label: 'Interests',
      value:
        partner?.interests?.length > 0 ? partner.interests.join(', ') : 'No Interests Provided',
      icon: <InterestsOutlinedIcon fontSize="small" color="primary" />
    },
    {
      label: 'Personality Type',
      value: toCapitalCase(partner?.personalityType) || 'Personality Type Not Provided',
      icon: <PsychologyOutlinedIcon fontSize="small" color="secondary" />
    },
    {
      label: 'Preferred Chat Style',
      value:
        partner?.preferredChatStyle?.length > 0
          ? partner.preferredChatStyle.join(', ')
          : 'Preferred Chat Style Not Provided',
      icon: <ForumOutlinedIcon fontSize="small" color="success" />
    },
    {
      label: 'Looking For',
      value: toCapitalCase(partner?.lookingFor) || 'Looking For Not Provided',
      icon: <Diversity3OutlinedIcon fontSize="small" color="warning" />
    },
    {
      label: 'Preferred Language',
      value: toCapitalCase(partner?.preferredLanguage) || 'Preferred Language Not Provided',
      icon: <TranslateOutlinedIcon fontSize="small" color="info" />
    }
  ];

  // Styles shared between both user and partner profile image
  const profileImageCommonStyle = {
    maxWidth: isSm ? 100 : 160,
    maxHeight: isSm ? 100 : 160,
    width: '100%',
    height: 'auto',
    mb: 2,
    objectFit: 'cover',
    borderRadius: '30%',
    mx: 'auto',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  };

  // handle friend request
  const handleFriendRequest = () => {
    setRequestingPrivateChat(true)
    // Emiting parivate chat requesting.
    socket.emit('privateChat:request');
  }

  return (
    <Modal open={open} onClose={onClose} sx={{ px: isSm ? 1 : 3, mt: 4 }}>
      <BlurWrapper
        sx={{
          overflowY: 'auto',
          maxHeight: '90vh',
          width: isSm ? '100%' : 420,
          mx: 'auto',
          borderRadius: 1,
          p: 0,
          background: theme.palette.background.paper
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
          borderBottom={`1px solid ${theme.palette.divider}`}
        >
          <IconButton onClick={handleProfileClose}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600} color={'text.primary'}>
            Profile
          </Typography>
          <IconButton onClick={handleProfileClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* Avatar + Name + Status */}
        <Stack alignItems="center" spacing={1.2} py={3}>
          <Avatar
            src={partner?.profileImage || defaultAvatar}
            sx={{
              width: 110,
              height: 110,
              border: `3px solid ${theme.palette.primary.main}`
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            {splitPartnerFullName[0]} {splitPartnerFullName[1] || ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {partner?.bio ? partner.bio : 'No bio available'}
          </Typography>
        </Stack>

        <Divider />

        {/* General Info */}
        {activeSection === 'general' && (
          <Box px={2} py={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color={'text.primary'}>
              General Info
            </Typography>
            <Stack spacing={1}>
              {generalInfo.map((info, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                  {info.icon}
                  <Typography variant="body2" fontWeight={500} color={'text.primary'}>
                    {info.label}:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Interests */}
        {activeSection === 'interests' && (
          <Box px={2} py={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color={'text.primary'}>
              Interests
            </Typography>
            <Stack spacing={1}>
              {partnerInterests.map((item, i) => (
                <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                  {item.icon}
                  <Typography variant="body2" fontWeight={500} color={'text.primary'}>
                    {item.label}:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Private Chat */}
        {activeSection === 'privateChat' && (
          <Box px={2} py={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color={'text.primary'}>
              Private Chat
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {requestingPrivateChat
                ? 'Requested for a private chat.'
                : 'Click below to send a request for a private chat with your partner.'}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              endIcon={<SendIcon />}
              onClick={handleFriendRequest}
              disabled={requestingPrivateChat}
              sx={{
                background: theme.palette.primary.main,
              }}
            >
              {requestingPrivateChat ? 'Request Sent' : 'Send Private Chat Request'}
            </Button>
          </Box>
        )}

        <Divider />

        {/* Bottom navigation (like Telegram sections) */}
        <Stack direction="row" justifyContent="space-around" py={1.5}>
          <Tooltip title="General Info">
            <IconButton onClick={() => handleClick('general')}>
              <InfoOutlinedIcon
                sx={{ color: activeSection === 'general' ? 'primary.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Interests">
            <IconButton onClick={() => handleClick('interests')}>
              <LocalOfferOutlinedIcon
                sx={{ color: activeSection === 'interests' ? 'primary.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Private Chat">
            <IconButton onClick={() => handleClick('privateChat')}>
              <LockPersonOutlinedIcon
                sx={{ color: activeSection === 'privateChat' ? 'primary.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      </BlurWrapper>
    </Modal>
  );
}

export default PartnerProfileModal;
