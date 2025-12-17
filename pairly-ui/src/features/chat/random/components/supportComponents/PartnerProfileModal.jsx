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
  PersonIcon,
  InfoOutlinedIcon,
  PsychologyOutlinedIcon,
  defaultAvatar,
  LocationOnOutlinedIcon,
  WcOutlinedIcon,
  RecordVoiceOverOutlinedIcon,
  InterestsOutlinedIcon,
  ForumOutlinedIcon,
  Diversity3OutlinedIcon,
  TranslateOutlinedIcon,
  CheckCircleIcon,
  StarIcon,
  PersonAddAltOutlinedIcon,
} from '@/MUI/MuiIcons';

// Country and State utilities
import { Country, State } from 'country-state-city';

// custom textFormatting.
import toCapitalCase from '@/utils/textFormatting';
// socket instance
import { socket } from '@/services/socket'

function PartnerProfileModal({ open, onClose, partner }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  const [activeSection, setActiveSection] = useState('general');
  const [requestingPrivateChat, setRequestingPrivateChat] = useState(false);

  const handleProfileClose = () => {
    onClose();
  };

  const handleClick = (target) => {
    setActiveSection(target);
  };

  const splitPartnerFullName = partner.fullName?.split(' ');

  const fullStateName = useMemo(() => {
    return partner?.location?.state
      ? State.getStateByCodeAndCountry(partner.location.state, partner.location.country)?.name
      : '—';
  }, [partner]);

  const fullCountryName = useMemo(() => {
    return partner?.location?.country
      ? Country.getCountryByCode(partner.location.country)?.name
      : '';
  }, [partner]);

  // Partner Plan
  const partnerPlan = partner?.subscription?.plan;
  const partnerStatus = partner?.subscription?.status;

  const isPartnerPremium =
    partnerStatus === 'active' && partnerPlan !== 'free';

  const generalInfo = [
    {
      label: 'Name',
      value: partner?.fullName || 'Unknown',
      icon: <PersonIcon fontSize="small" color="primary" />
    },
    {
      label: 'Age',
      value: partner?.age || '—',
      icon: <InfoOutlinedIcon fontSize="small" color="info" />
    },
    {
      label: 'Location',
      value: `${fullStateName} ${fullCountryName}` || 'Unknown',
      icon: <LocationOnOutlinedIcon fontSize="small" color="success" />
    },
    {
      label: 'Gender',
      value: toCapitalCase(partner?.gender) || '—',
      icon: <WcOutlinedIcon fontSize="small" color="secondary" />
    },
    {
      label: 'Pronouns',
      value: toCapitalCase(partner?.pronouns) || '—',
      icon: <RecordVoiceOverOutlinedIcon fontSize="small" color="warning" />
    }
  ];

  const partnerInterests = [
    {
      label: 'Interests',
      value:
        partner?.interests?.length > 0 ? partner.interests.join(', ') : '—',
      icon: <InterestsOutlinedIcon fontSize="small" color="primary" />
    },
    {
      label: 'Personality Type',
      value: toCapitalCase(partner?.personalityType) || '—',
      icon: <PsychologyOutlinedIcon fontSize="small" color="secondary" />
    },
    {
      label: 'Preferred Chat Style',
      value:
        partner?.preferredChatStyle?.length > 0
          ? partner.preferredChatStyle.join(', ')
          : '—',
      icon: <ForumOutlinedIcon fontSize="small" color="success" />
    },
    {
      label: 'Looking For',
      value: toCapitalCase(partner?.lookingFor) || '—',
      icon: <Diversity3OutlinedIcon fontSize="small" color="warning" />
    },
    {
      label: 'Preferred Language',
      value: toCapitalCase(partner?.preferredLanguage) || '—',
      icon: <TranslateOutlinedIcon fontSize="small" color="info" />
    }
  ];

  const handleFriendRequest = () => {
    setRequestingPrivateChat(true)
    socket.emit('privateChat:request');
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        px: isSm ? 1 : 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: '90vh',
          width: isSm ? '70%' : 380,
          mx: 'auto',
          borderRadius: 1,
          p: 0,
          background: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={0.5}
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
        <Stack
          alignItems="center"
          spacing={1}
          mt={1}
        >
          <Avatar
            src={partner?.profileImage || defaultAvatar}
            sx={{
              width: isSm ? 88 : 110,
              height: isSm ? 88 : 110,
              borderRadius: '50%',
              boxShadow: `0 4px 14px ${theme.palette.common.black}20`,
              backgroundColor: theme.palette.background.paper,
            }}
          />

          <Stack direction="row" alignItems="center" spacing={0.6}>
            <Typography
              variant="h6"
              fontWeight={600}
              color="text.primary"
            >
              {splitPartnerFullName[0]} {splitPartnerFullName[1] || ''}
            </Typography>

            {partner.isUserVerifiedByEmail && (
              isPartnerPremium ? (
                <Tooltip title="Premium User" arrow>
                  <StarIcon
                    sx={{
                      color: theme.palette.warning.main,
                      fontSize: 18,
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Verified User" arrow>
                  <CheckCircleIcon
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: 18,
                    }}
                  />
                </Tooltip>
              )
            )}
          </Stack>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{
              maxWidth: '85%',
              lineHeight: 1.5,
            }}
          >
            {partner?.bio || 'No bio available'}
          </Typography>
        </Stack>

        <Divider sx={{ mt: 1, background: theme.palette.divider }} />

        {/* navigation */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent='center'
          gap={1}
          px={2}
          py={1}
        >
          {[
            { key: 'general', label: 'General' },
            { key: 'interests', label: 'Interests' },
            { key: 'privateChat', label: 'Private Chat' },
          ].map((item) => {
            const isActive = activeSection === item.key;

            return (
              <Button
                key={item.key}
                onClick={() => handleClick(item.key)}
                size="small"
                variant="text"
                sx={{
                  textTransform: 'none',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  px: 1.6,
                  py: 0.6,
                  borderRadius: 20,
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  backgroundColor: isActive
                    ? theme.palette.primary.light + '22'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>

        {/* General Info */}
        {activeSection === 'general' && (
          <Box
            px={2}
            py={2}
            display="flex"
            flexDirection="column"
            gap={1}
            sx={(theme) => ({
              background: `linear-gradient(180deg,
      ${theme.palette.background.paper},
      ${theme.palette.info.dark}10)`,
            })}
          >
            <Stack spacing={1.2}>
              {generalInfo.map((info, i) => (
                <Stack
                  key={i}
                  direction="row"
                  alignItems="center"
                  gap={4}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.4}
                    sx={{
                      width: 100
                    }}
                  >
                    {info.icon}
                    <Typography
                      variant="body2"
                      fontWeight={400}
                      color="text.secondary"
                    >
                      {info.label}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.primary"
                    textAlign="right"
                    fontWeight={600}
                    sx={{ maxWidth: '60%' }}
                  >
                    {info.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Interests */}
        {activeSection === 'interests' && (
          <Box
            px={2}
            py={2}
            display="flex"
            flexDirection="column"
            gap={1}
            sx={(theme) => ({
              background: `linear-gradient(180deg,
      ${theme.palette.background.paper},
      ${theme.palette.info.dark}10)`,
            })}
          >
            <Stack
              spacing={1.2}
            >
              {partnerInterests.map((item, i) => (
                <Stack
                  key={i}
                  direction="row"
                  alignItems="center"
                  gap={4}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.4}
                    sx={{
                      width: 200
                    }}
                  >
                    {item.icon}
                    <Typography
                      variant="body2"
                      fontWeight={400}
                      color="text.secondary"
                    >
                      {item.label}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.primary"
                    textAlign="right"
                    fontWeight={600}
                    sx={{ maxWidth: '60%' }}
                  >
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Private Chat */}
        {activeSection === 'privateChat' && (
          <Box
            px={2}
            py={2.5}
            sx={(theme) => ({
              background: `linear-gradient(180deg,
        ${theme.palette.background.paper},
        ${theme.palette.info.dark}10)`,
            })}
          >
            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.6, mb: 2 }}
            >
              {requestingPrivateChat
                ? 'Your private chat request has been sent. Please wait for approval.'
                : 'Start a one-to-one private conversation by sending a chat request.'}
            </Typography>

            {/* CTA */}
            <Tooltip
              arrow
              title={requestingPrivateChat ? 'Request already sent' : 'Send request'}
            >
              <span>
                {/* span is required so Tooltip works when button is disabled */}
                <Button
                  onClick={() => !requestingPrivateChat && handleFriendRequest()}
                  disabled={requestingPrivateChat}
                  endIcon={<PersonAddAltOutlinedIcon />}
                  sx={(theme) => ({
                    px: 2.5,
                    py: 1.1,
                    borderRadius: requestingPrivateChat ? 1.2 : 0.2,
                    fontWeight: 500,

                    border: `1px solid ${requestingPrivateChat
                      ? theme.palette.divider
                      : theme.palette.success.main
                      }`,

                    color: requestingPrivateChat
                      ? theme.palette.text.disabled
                      : theme.palette.success.main,

                    backgroundColor: requestingPrivateChat
                      ? theme.palette.action.disabledBackground
                      : theme.palette.success.light + '25',

                    boxShadow: requestingPrivateChat
                      ? 'none'
                      : `0 0 10px ${theme.palette.success.main}55`,

                    transition: 'all 0.3s ease',

                    '&:hover': !requestingPrivateChat && {
                      backgroundColor: theme.palette.success.light + '40',
                      boxShadow: `0 0 16px ${theme.palette.success.main}88`,
                      transform: 'translateY(-1px)',
                      borderRadius: 1.2
                    },

                    '&:active': !requestingPrivateChat && {
                      transform: 'scale(0.96)',
                    },
                  })}
                >
                  {requestingPrivateChat ? 'Request Sent' : 'Send Private Chat Request'}
                </Button>
              </span>
            </Tooltip>

          </Box>
        )}

      </Box>
    </Modal >
  );
}

export default PartnerProfileModal;
