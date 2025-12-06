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
  LocationOnOutlinedIcon,
  WcOutlinedIcon,
  RecordVoiceOverOutlinedIcon,
  InterestsOutlinedIcon,
  ForumOutlinedIcon,
  Diversity3OutlinedIcon,
  TranslateOutlinedIcon,
  CheckCircleIcon,
  StarIcon
} from '@/MUI/MuiIcons';

// components
import BlurWrapper from '@/components/common/BlurWrapper';
import StyledButton from '../../../../../components/common/StyledButton';

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
      : '';
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
    }
  ];

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

  const handleFriendRequest = () => {
    setRequestingPrivateChat(true)
    socket.emit('privateChat:request');
  }

  const getNavButtonStyles = (isActive) => ({
    background: isActive ? theme.palette.primary.dark : theme.palette.background.default,
    color: isActive ? '#fff' : theme.palette.text.secondary,
    borderRadius: 2,
    p: 1,
    boxShadow: isActive ? `0 0 8px ${theme.palette.primary.main}55` : 'none',
    transition: 'all 0.25s ease',
    '&:hover': {
      background: isActive ? 'none' : theme.palette.action.hover,
      boxShadow: isActive ? `0 0 20px ${theme.palette.primary.main}77` : 'none',
    },
  });

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
          background: theme.palette.background.default
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
        <Stack alignItems="center" spacing={1.2} >
          <Avatar
            src={partner?.profileImage || defaultAvatar}
            sx={{
              border: `3px solid ${theme.palette.primary.main}`,
              width: isSm ? 90 : 120,
              height: isSm ? 90 : 120,
              borderRadius: "50%",
              objectFit: "cover",
              mb: 1,
              transition: 'all 0.3s ease-in-out',
              ':hover': {
                border: `none`,
                transform: isSm ? 'scale(2.6)' : 'scale(2.3)',
                borderRadius: 1,
              }
            }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={0.2}
          >
            {splitPartnerFullName[0]?.toUpperCase()} {splitPartnerFullName[1]?.toUpperCase() || ''}
            {partner.isUserVerifiedByEmail && (
              <>
                {isPartnerPremium ? (
                  <Tooltip title="Premium User">
                    <StarIcon
                      sx={{
                        color: theme.palette.warning.dark,
                        fontSize: 20,
                        ml: 0.5,
                        filter: `drop-shadow(0 0 1rem)`
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Verified User">
                    <CheckCircleIcon
                      sx={{
                        color: 'gray',
                        fontSize: 20,
                        ml: 0.5,
                        filter: `drop-shadow(0 0 1rem)`
                      }}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </Typography>
          <Typography
            variant="body2"
            textAlign='center'
            color="text.secondary"
            sx={{ fontStyle: 'italic', fontWeight: 600 }}
          >
            {partner?.bio ? partner.bio : 'No bio available'}
          </Typography>
        </Stack>

        <Divider sx={{ height: 4, background: theme.palette.divider }} />

        {/* navigation */}
        <Stack
          direction="row"
          justifyContent="space-around"
          py={1.2}
          sx={{
            backdropFilter: 'blur(8px)',
            background: theme.palette.background.paper,
            borderRadius: 1,
            mx: 2,
            px: 1,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: `0 2px 6px ${theme.palette.action.hover}`,
          }}
        >
          <Tooltip title="General Info">
            <IconButton
              onClick={() => handleClick('general')}
              sx={getNavButtonStyles(activeSection === 'general')}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Interests">
            <IconButton
              onClick={() => handleClick('interests')}
              sx={getNavButtonStyles(activeSection === 'interests')}
            >
              <LocalOfferOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Private Chat">
            <IconButton
              onClick={() => handleClick('privateChat')}
              sx={getNavButtonStyles(activeSection === 'privateChat')}
            >
              <LockPersonOutlinedIcon />
            </IconButton>
          </Tooltip>

        </Stack>

        {/* General Info */}
        {activeSection === 'general' && (
          <Box px={2} pb={2} display="flex" flexDirection="column" gap={1}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color={'text.primary'}>
              General Info
            </Typography>

            <Stack spacing={1.2}>
              {generalInfo.map((info, i) => (
                <Stack
                  key={i}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.3,
                    borderRadius: 0.5,
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.25s ease',

                    '&:hover': {
                      boxShadow: `0 2px 8px ${theme.palette.action.hover}`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.4}>
                    {info.icon}
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {info.label}:
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="right"
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
          <Box px={2} pb={2} display="flex" flexDirection="column" gap={1}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color={'text.primary'}>
              Interests
            </Typography>
            <Stack spacing={1}>
              {partnerInterests.map((item, i) => (
                <Stack
                  key={i}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.3,
                    borderRadius: 0.5,
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.25s ease',

                    '&:hover': {
                      boxShadow: `0 2px 8px ${theme.palette.action.hover}`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    {item.icon}
                    <Typography variant="body2" fontWeight={600}>
                      {item.label}:
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" textAlign="right">
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Private Chat */}
        {activeSection === 'privateChat' && (
          <Box px={2} pb={2} display="flex" flexDirection="column" gap={1.5}>

            {/* Title */}
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color={'text.primary'}>
              Private Chat
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.5 }}
            >
              {requestingPrivateChat
                ? 'You have already requested a private chat.'
                : 'Send a private chat request to your partner to start a direct conversation.'}
            </Typography>

            {/* CTA Button */}
            <StyledButton
              fullWidth
              endIcon={<SendIcon />}
              onClick={handleFriendRequest}
              disabled={requestingPrivateChat}
              text={requestingPrivateChat ? 'Request Sent' : 'Send Private Chat Request'}
            />
          </Box>
        )}

      </BlurWrapper>
    </Modal>
  );
}

export default PartnerProfileModal;
