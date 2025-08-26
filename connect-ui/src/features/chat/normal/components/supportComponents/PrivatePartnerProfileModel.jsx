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
  useTheme
} from '@/MUI/MuiComponents';
import {
  ArrowBackIcon,
  CloseIcon,
  PersonIcon,
  InfoOutlinedIcon,
  PsychologyOutlinedIcon,
  LocalOfferOutlinedIcon,
  defaultAvatar,
  GraphicEqIcon,
  LocationOnOutlinedIcon,
  WcOutlinedIcon,
  RecordVoiceOverOutlinedIcon,
  SubjectOutlinedIcon,
  InterestsOutlinedIcon,
  ForumOutlinedIcon,
  Diversity3OutlinedIcon,
  TranslateOutlinedIcon,
  FavoriteBorderIcon
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

function PrivatePartnerProfileModel({ userId, open, onClose }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  const [activeSection, setActiveSection] = useState('general');
  const [requestingCouple, setRequestingCouple] = useState(false);

  const { profileData } = useSelector((state) => state.profile);

  // get all users from redux
  const users = useSelector(state => state.privateChat.users);

  // partner profile (already flat, no nested .profile)
  const partnerProfile = useMemo(() => {
    return users.find((u) => u.userId === userId)?.profile || {};
  }, [users, userId]);

  // Close modal handler
  const handleProfileClose = () => {
    onClose();
  };

  const handleClick = (target) => {
    setActiveSection(target);
  };

  // Split partner name
  const splitPartnerFullName = partnerProfile?.fullName
    ? partnerProfile.fullName.split(' ')
    : ['Stranger'];

  // State name
  const location = useMemo(() => {
    const state = partnerProfile?.state
      ? State.getStateByCodeAndCountry(
        partnerProfile.state,
        partnerProfile.country
      )?.name
      : '';

    const country = partnerProfile?.country
      ? Country.getCountryByCode(partnerProfile?.country)?.name
      : '';

    return [state, country].filter(Boolean).join(' ');
  }, [partnerProfile]);


  const detailsStyles = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-Start',
    alignItems: 'center',
    gap: 1,
    mb: 1,
    flexWrap: 'wrap'
  };

  const generalInfo = [
    {
      label: 'Name',
      value: partnerProfile?.fullName || 'Unknown',
      icon: <PersonIcon fontSize="small" color="primary" />
    },
    {
      label: 'Age',
      value: partnerProfile?.age || 'Unknown',
      icon: <InfoOutlinedIcon fontSize="small" color="info" />
    },
    {
      label: 'Location',
      value: `${location}` || 'Unknown',
      icon: <LocationOnOutlinedIcon fontSize="small" color="success" />
    },
    {
      label: 'Gender',
      value: toCapitalCase(partnerProfile?.gender) || 'Unknown',
      icon: <WcOutlinedIcon fontSize="small" color="secondary" />
    },
    {
      label: 'Pronouns',
      value: toCapitalCase(partnerProfile?.pronouns) || 'Unknown',
      icon: <RecordVoiceOverOutlinedIcon fontSize="small" color="warning" />
    },
    {
      label: 'Bio',
      value: partnerProfile?.shortBio || 'No bio available',
      icon: <SubjectOutlinedIcon fontSize="small" color="action" />
    }
  ];

  const partnerInterests = [
    {
      label: 'Interests',
      value:
        partnerProfile?.interests?.length > 0
          ? partnerProfile.interests.join(', ')
          : 'No Interests Provided',
      icon: <InterestsOutlinedIcon fontSize="small" color="primary" />
    },
    {
      label: 'Personality Type',
      value: toCapitalCase(partnerProfile?.personality) || 'Personality Type Not Provided',
      icon: <PsychologyOutlinedIcon fontSize="small" color="secondary" />
    },
    {
      label: 'Preferred Chat Style',
      value:
        partnerProfile?.preferredChatStyle?.length > 0
          ? partnerProfile.preferredChatStyle.join(', ')
          : 'Preferred Chat Style Not Provided',
      icon: <ForumOutlinedIcon fontSize="small" color="success" />
    },
    {
      label: 'Looking For',
      value: toCapitalCase(partnerProfile?.lookingFor) || 'Looking For Not Provided',
      icon: <Diversity3OutlinedIcon fontSize="small" color="warning" />
    },
    {
      label: 'Preferred Language',
      value: toCapitalCase(partnerProfile?.preferredLanguage) || 'Preferred Language Not Provided',
      icon: <TranslateOutlinedIcon fontSize="small" color="info" />
    }
  ];

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

  const handleCoupleRequest = () => {
    setRequestingCouple(true);
    // socket.emit('couple:request');
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ px: isSm ? 2 : 3, mt: 8 }}>
      <BlurWrapper
        sx={{
          overflowY: 'auto',
          maxHeight: '70vh',
          width: 'auto',
        }}
      >
        <Stack
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          maxHeight={'fit-content'}
        >
          <Tooltip title={<StyledText text={'Close Profile'} />}>
            <IconButton onClick={handleProfileClose}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" color="text.secondary" letterSpacing={0.5} fontWeight={600}>
            {<StyledText text={splitPartnerFullName[0]}/>} {splitPartnerFullName[1] || ''}
          </Typography>
        </Stack>

        <Divider sx={{ color: theme.palette.divider }} />

        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.2
          }}
        >
          <Stack
            component={'img'}
            src={partnerProfile?.profileImage || defaultAvatar}
            alt="Partner Profile Image"
            sx={profileImageCommonStyle}
          />
          <GraphicEqIcon fontSize="large" sx={{ color: 'success.main' }} />
          <Stack
            component={'img'}
            src={profileData.profileImage || defaultAvatar}
            alt="Your Profile Image"
            sx={profileImageCommonStyle}
          />
        </Stack>

        {/* Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Tooltip title={<StyledText text={'View Info'} />}>
            <IconButton onClick={() => handleClick('general')}>
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: activeSection === 'general' ? 'success.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={<StyledText text={'Interests'} />}>
            <IconButton onClick={() => handleClick('interests')}>
              <LocalOfferOutlinedIcon
                fontSize="small"
                sx={{ color: activeSection === 'interests' ? 'success.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={<StyledText text={'Couple Request'} />}>
            <IconButton onClick={() => handleClick('coupleRequest')}>
              <FavoriteBorderIcon
                fontSize="small"
                sx={{ color: activeSection === 'coupleRequest' ? 'success.main' : 'text.secondary' }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ color: theme.palette.divider }} />

        {/* Content */}
        <Stack>
          {activeSection === 'general' && (
            <Box flexDirection={'column'}>
              <Typography letterSpacing={1} fontWeight={600} variant="h6" mb={1}>
                <StyledText text={'General Info'} />
              </Typography>
              {generalInfo.map((info, index) => (
                <Stack key={index}>
                  <Stack sx={detailsStyles}>
                    {info.icon}
                    <Typography variant="body2" color="text.primary">
                      {info.label}:
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
              <Typography letterSpacing={1} fontWeight={600} variant="h6" mb={1}>
                <StyledText text={'Interests'} />
              </Typography>
              {partnerInterests.map((interest, index) => (
                <Stack key={index}>
                  <Stack sx={detailsStyles}>
                    {interest.icon}
                    <Typography variant="body2" color="text.primary">
                      {interest.label}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interest.value}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Box>
          )}
          {activeSection === 'coupleRequest' && (
            <Box flexDirection={'column'}>
              <Typography letterSpacing={1} fontWeight={600} variant="h6" mb={1}>
                <StyledText text={'Couple Request'} />
              </Typography>

              <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: 2,
                px: 2
              }}>
                <Box
                  borderRight={`1px solid ${theme.palette.divider}`}
                  px={2}
                >
                  <Typography
                    variant="body2"
                    color="text.primany"
                    mb={2}
                  >
                    Propose to your partner for:
                    <ul style={{ marginLeft: '16px', paddingLeft: '16px' }}>
                      <li><Typography variant="body2" color="text.secondary">Relationship</Typography></li>
                      <li><Typography variant="body2" color="text.secondary">Marriage</Typography></li>
                      <li><Typography variant="body2" color="text.secondary">Long-distance Bond</Typography></li>
                      <li><Typography variant="body2" color="text.secondary">Casual | Fun & more</Typography></li>
                    </ul>
                  </Typography>
                </Box>

                <Box
                  borderLeft={`1px solid ${theme.palette.divider}`}
                  px={2}
                >
                  <Typography
                    variant="body2"
                    color="text.primany"
                    mt={1}
                  >
                    Once accepted, both unlock:
                    <ul style={{ marginLeft: '16px', paddingLeft: '16px' }}>
                      <li><Typography variant="body2" color="text.secondary">Watch together (Netflix, YouTube, etc.)</Typography></li>
                      <li><Typography variant="body2" color="text.secondary">Private audio/video calls</Typography></li>
                      <li><Typography variant="body2" color="text.secondary">Shared gallery & notes</Typography></li>
                      <li><Typography variant="body2" color="text.secondary">Incognito mode & more</Typography></li>
                    </ul>
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                color="primary"
                endIcon={<FavoriteBorderIcon sx={{ color: 'warning.main' }} />}
                onClick={handleCoupleRequest}
                disabled={requestingCouple}
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
                {requestingCouple ? 'Request Sent' : 'Send Couple Request'}
              </Button>
            </Box>
          )}
        </Stack>

        <Stack width={'100%'}>
          <Button
            onClick={handleProfileClose}
            variant="outlined"
            endIcon={<CloseIcon fontSize="small" sx={{ color: theme.palette.secondary.light }} />}
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
    </Modal>
  );
}

export default PrivatePartnerProfileModel;
