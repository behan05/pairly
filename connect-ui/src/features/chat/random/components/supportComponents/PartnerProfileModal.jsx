import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
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

import { toast } from 'react-toastify';
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
  const { incomingRequest } = useSelector((state) => state.randomChat);

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
    maxWidth: isSm ? 110 : 180,
    maxHeight: isSm ? 110 : 180,
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
    if (!incomingRequest) {
      toast.success('Private chat request sent. Awaiting partner approval.', {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.divider,
          color: theme.palette.text.primary,
        }
      });
    }
  }

  return (
    <Box sx={{ px: isSm ? 2 : 3 }}>
      {/* Wrapper with blur and scrollable area */}
      <BlurWrapper
        sx={{
          display: open ? 'block' : 'none',
          overflowY: 'auto',
          maxHeight: '70vh',
          width: 'auto'
        }}
      >
        {/* Top header with back button and name */}
        <Stack
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Tooltip title={<StyledText text={`${'Close Profile'}`} />}>
            <IconButton onClick={handleProfileClose}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" color="text.secondary" letterSpacing={0.5} fontWeight={600}>
            {<StyledText text={splitPartnerFullName[0]} />} {splitPartnerFullName[1]}
          </Typography>
        </Stack>

        <Divider sx={{ color: theme.palette.divider, my: 2 }} />

        {/* Profile images side-by-side */}
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Stack
            component={'img'}
            src={partner?.profileImage || defaultAvatar}
            alt="Partner Profile Image"
            aria-label="Partner Profile Image"
            sx={profileImageCommonStyle}
          />
          <GraphicEqIcon fontSize="large" sx={{ color: 'success.main' }} />
          <Stack
            component={'img'}
            src={profileData?.profileImage || defaultAvatar}
            alt="Partner Profile Image"
            aria-label="Partner Profile Image"
            sx={profileImageCommonStyle}
          />
        </Stack>

        {/* Tabs (general, interests, private chat) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 2, flexWrap: 'wrap' }}>
          <Tooltip title={<StyledText text={`${'View Info'}`} />}>
            <IconButton onClick={() => handleClick('general')}>
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: activeSection === 'general' ? 'success.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={<StyledText text={`${'Interests'}`} />}>
            <IconButton onClick={() => handleClick('interests')}>
              <LocalOfferOutlinedIcon
                fontSize="small"
                sx={{ color: activeSection === 'interests' ? 'success.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={<StyledText text={`${'Request Private Chat'}`} />}>
            <IconButton onClick={() => handleClick('privateChat')}>
              <LockPersonOutlinedIcon
                fontSize="small"
                sx={{ color: activeSection === 'privateChat' ? 'success.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ color: theme.palette.divider, my: 2 }} />

        {/* Main content based on tab */}
        <Stack mt={2}>
          {activeSection === 'general' && (
            <Box flexDirection={'column'}>
              <Typography gutterBottom letterSpacing={1} fontWeight={600} variant="h6" mb={2}>
                <StyledText text={'General Info'} />
              </Typography>
              {generalInfo.map((info, index) => (
                <Stack key={index}>
                  <Stack sx={detailsStyles}>
                    {info.icon}
                    <Typography variant="body1" color="text.primary">
                      <strong>{info.label}</strong>:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {info.value}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Box>
          )}
          {activeSection === 'interests' && (
            <Box flexDirection={'column'}>
              <Typography gutterBottom letterSpacing={1} fontWeight={600} variant="h6" mb={2}>
                <StyledText text={'Interests'} />
              </Typography>
              {partnerInterests.map((interests, index) => (
                <Stack key={index}>
                  <Stack sx={detailsStyles}>
                    {interests.icon}
                    <Typography variant="body1" color="text.primary">
                      <strong>{interests.label}</strong>:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interests.value}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Box>
          )}
          {activeSection === 'privateChat' && (
            <Box flexDirection={'column'}>
              <Typography gutterBottom letterSpacing={1} fontWeight={600} variant="h6" mb={2}>
                <StyledText text={'Private Chat'} />
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {requestingPrivateChat
                  ? 'Requested for a private chat.'
                  : 'Click the button below to send a request for a private chat with your partner.'}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<SendIcon sx={{ color: 'text.secondary' }} />}
                aria-label="Send Private Chat Request"
                onClick={handleFriendRequest}
                disabled={requestingPrivateChat}
                sx={{
                  mt: 2,
                  width: 'fit-content',
                  alignSelf: 'flex-start',
                  transition: 'all 0.3s ease-in-out',
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.divider,
                  '&:focus': {
                    outline: 'none',
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                  },
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary
                  }
                }}
              >
                {requestingPrivateChat ? 'Request Sent' : 'Send Private Chat Request'}
              </Button>
            </Box>
          )}
        </Stack>

        {/* Close button at the bottom */}
        <Stack width={'100%'} mt={2}>
          <Button
            onClick={handleProfileClose}
            variant="outlined"
            endIcon={<CloseIcon fontSize="small" sx={{ color: theme.palette.secondary.light }} />}
            aria-label="Close Profile"
            sx={{
              maxWidth: 'fit-content',
              alignSelf: 'flex-end',
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              transition: 'all 0.3s ease-in-out',
              '&:focus': {
                outline: 'none',
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary
              }
            }}
          >
            <StyledText text={'Close Profile'} />
          </Button>
        </Stack>
      </BlurWrapper>
    </Box>
  );
}

export default PartnerProfileModal;
