import React, { useEffect, useMemo, useState } from 'react'

import {
    Box,
    Modal,
    Typography,
    TextField,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    InputLabel,
    Stack,
    useTheme,
    IconButton,
    Tooltip,
    Pagination,
    PaginationItem,
    Button
} from '../../../../../MUI/MuiComponents';
import {
    defaultAvatar,
    RefreshIcon,
    ArrowBackIcon,
    ArrowForwardIcon
} from '../../../../../MUI/MuiIcons';

import {
    proposeMessages,
    proposeTypes,
    proposalThemes,
    backgroundOptions,
    animationStyles,
    giftTokens,
    proposalAudioOptions
} from '@/utils/proposeMessages';
import ProposalPreview from './ProposalPreview';
import ProposalLottie from './ProposalLottieAnimation';
import { useDispatch, useSelector } from 'react-redux';
import { getMusicBySelectType } from '@/redux/slices/privateChat/privateChatAction';

function ProposeToPartnerModel({ open, onClose, partnerId }) {

    const { allUsers } = useSelector(state => state.privateChat);
    const { proposalMusic } = useSelector(state => state.privateChat);
    const [musicPage, setMusicPage] = useState(1);

    const { profileData } = useSelector(state => state.profile);
    const myProfile = {
        profileImage: profileData?.profileImage,
        fullName: profileData?.fullName?.split(' ')[0],
    };

    const dispatch = useDispatch();

    const partnerProfileData = useMemo(() => {
        return allUsers.find((p) => p.userId === partnerId)?.profile || null
    }, [allUsers, partnerId]);

    const showProfilePic = useMemo(() => {
        return allUsers.find((p) => p.userId === partnerId)?.settings?.showProfilePic || false
    }, [allUsers, partnerId]);

    const partnerProfile = {
        profileImage: partnerProfileData?.profileImage,
        fullName: partnerProfileData?.fullName?.split(' ')[0]
    };

    const theme = useTheme();
    const [formData, setFormData] = React.useState({
        proposalType: '',
        personalMessage: '',
        proposalThemes: '',
        proposalBackground: '',
        proposalAnimationStyle: '',
        proposalGiftToken: '',
        proposalMusictype: '',
        proposalIntentionNote: '',
        proposalPrivateNote: '',
    });

    const [generateRandomMessage, setGenerateRandomMessage] = useState('');
    const [page, setPage] = useState(0);
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        if (page === 4) {
            setPage(0)
        } else if (page === -1) {
            setPage(3)
        }
    }, [page]);

    const handleClose = () => {
        onClose()
    };

    // Pick a random bio
    const randomMessage = proposeMessages[Math.floor(Math.random() * proposeMessages.length)];

    useEffect(() => {
        setGenerateRandomMessage(randomMessage);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => (
            { ...prev, [name]: value }
        ));

        if (name === 'proposalMusictype') {
            dispatch(getMusicBySelectType(value));
        };
    };

    const handleProposalRequest = () => { };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropProps={{
                timeout: 500,
                sx: {
                    // Backdrop styling with blur effect and transparency
                    backdropFilter: 'blur(8px)',
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? theme.palette.background.paper + 'AA'
                            : theme.palette.background.default + 'AA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            }}
        >
            {preview ? (
                <ProposalPreview
                    partnerProfile={partnerProfile}
                    showProfilePic={showProfilePic}
                    myProfile={myProfile}
                    onClose={setPreview}
                />
            ) : (
                <Box
                    sx={{
                        // Modal container styling and center positioning
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 500 },
                        background: `linear-gradient(135deg,
                    ${theme.palette.primary.light}15,
                    ${theme.palette.background.default} 70%)`,
                        overflow: 'hidden',
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        outline: 'none',
                    }}
                >
                    {/* Profile images and Lottie animation */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {/* User profile image */}
                        {myProfile.profileImage && (
                            <Box
                                component="img"
                                src={myProfile.profileImage}
                                alt="My Profile"
                                sx={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: `3px solid ${theme.palette.primary.main}`,
                                    boxShadow: `0 0 25px ${theme.palette.primary.main}55`,
                                    animation: 'floatMine 4s ease-in-out infinite, pulseGlowMine 2s infinite',
                                    transition: 'all 0.4s ease',
                                    '@keyframes floatMine': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(6px)' },
                                    },
                                    '@keyframes pulseGlowMine': {
                                        '0%, 100%': { boxShadow: `0 0 15px ${theme.palette.primary.main}55` },
                                        '50%': { boxShadow: `0 0 30px ${theme.palette.primary.light}88` },
                                    },
                                }}
                            />
                        )}

                        {/* Lottie heartbeat animation */}
                        <Box sx={{ width: 70, height: 70 }}>
                            <ProposalLottie />
                        </Box>

                        {/* Partner profile image */}
                        {partnerProfile && (
                            <Box
                                component="img"
                                src={showProfilePic ? partnerProfile?.profileImage : defaultAvatar}
                                alt="Partner Profile"
                                sx={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: `3px solid ${theme.palette.primary.main}`,
                                    boxShadow: `0 0 25px ${theme.palette.primary.main}55`,
                                    animation: 'floatImage 4s ease-in-out infinite, pulseGlow 2s infinite',
                                    transition: 'all 0.4s ease',
                                    '@keyframes floatImage': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-6px)' },
                                    },
                                    '@keyframes pulseGlow': {
                                        '0%, 100%': { boxShadow: `0 0 15px ${theme.palette.primary.main}55` },
                                        '50%': { boxShadow: `0 0 30px ${theme.palette.primary.light}88` },
                                    },
                                }}
                            />
                        )}
                    </Box>

                    {/* Names of users */}
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
                        {/* My Name */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                textShadow: (theme) => `0 0 6px ${theme.palette.primary.main}33`,
                                letterSpacing: 0.5,
                                animation: 'fadeInLeft 1s ease forwards',
                                '@keyframes fadeInLeft': {
                                    '0%': { opacity: 0, transform: 'translateX(-10px)' },
                                    '100%': { opacity: 1, transform: 'translateX(0)' },
                                },
                            }}
                        >
                            {myProfile.fullName}
                        </Typography>

                        {/* Partner Name */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                textShadow: (theme) => `0 0 6px ${theme.palette.secondary.main}33`,
                                letterSpacing: 0.5,
                                animation: 'fadeInRight 1s ease forwards',
                                '@keyframes fadeInRight': {
                                    '0%': { opacity: 0, transform: 'translateX(10px)' },
                                    '100%': { opacity: 1, transform: 'translateX(0)' },
                                },
                            }}
                        >
                            {partnerProfile.fullName}
                        </Typography>
                    </Stack>

                    {/* Form / Proposal input area */}
                    <Box component="form" sx={{ width: '100%' }}>
                        <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
                            Create a memorable moment! ✨💖
                        </Typography>

                        {page === 0 ? (
                            <Stack gap={1.5}>
                                {/* Proposal Type Dropdown */}
                                <FormControl fullWidth>
                                    <InputLabel id="proposal-type-label">Proposal Type</InputLabel>
                                    <Select
                                        labelId="proposal-type-label"
                                        id="proposal-type-select"
                                        label="Proposal Type"
                                        name='proposalType'
                                        onChange={handleChange}
                                    >
                                        {proposeTypes.map((type, i) => (
                                            <MenuItem key={i} value={type.label}>
                                                {type.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Custom message input */}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={generateRandomMessage}
                                    name='proposalMessage'
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip title="Change Message" arrow>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        p: 0.5,
                                                        color: 'primary.main',
                                                        backgroundColor: 'action.hover',
                                                        '&:hover': {
                                                            color: 'primary.dark',
                                                        },
                                                    }}
                                                >
                                                    <RefreshIcon
                                                        onClick={() => setGenerateRandomMessage(randomMessage)}
                                                        fontSize="medium"
                                                        sx={{
                                                            transition: 'transform 0.6s ease-in-out',
                                                            color: 'info.main',
                                                            '&:hover': {
                                                                color: 'warning.main',
                                                                transform: 'rotate(360deg)',
                                                            },
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Stack>
                        ) : page === 1 ? (
                            <Stack gap={1.5}>
                                {/* Proposal Theme Dropdown */}
                                <FormControl fullWidth>
                                    <InputLabel id="proposal-theme-label">Proposal Theme</InputLabel>
                                    <Select
                                        labelId="proposal-theme-label"
                                        id="proposal-theme-select"
                                        label="Proposal theme"
                                        name='proposalThemes'
                                        onChange={handleChange}
                                    >
                                        {proposalThemes.map((theme, i) => (
                                            <MenuItem key={i} value={theme.label}>
                                                {theme.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Background Dropdown */}
                                <FormControl fullWidth>
                                    <InputLabel id="proposal-backgroundOptions-label">Select Background Type</InputLabel>
                                    <Select
                                        labelId="proposal-backgroundOptions-label"
                                        id="proposal-backgroundOptions-select"
                                        label="Select Background Type"
                                        name='proposalBackground'
                                        onChange={handleChange}
                                    >
                                        {backgroundOptions.map((background, i) => (
                                            <MenuItem key={i} value={background.label}>
                                                {background.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Animation Style Dropdown */}
                                <FormControl fullWidth>
                                    <InputLabel id="proposal-animationStyles-label">Select Animation Style</InputLabel>
                                    <Select
                                        labelId="proposal-animationStyles-label"
                                        id="proposal-animationStyles-select"
                                        label="Select Background Type"
                                        name='proposalAnimationStyle'
                                        onChange={handleChange}
                                    >
                                        {animationStyles.map((animation, i) => (
                                            <MenuItem key={i} value={animation.label}>
                                                {animation.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        ) : page === 2 ? (
                            <Stack gap={1.5}>
                                {/* Gift / Token Dropdown */}
                                <FormControl fullWidth>
                                    <InputLabel id="proposal-giftToken-label">Select Gift Tokens</InputLabel>
                                    <Select
                                        labelId="proposal-giftToken-label"
                                        id="proposal-giftToken-label"
                                        label="Select Gift Tokens"
                                        name='proposalGiftToken'
                                        onChange={handleChange}
                                    >
                                        {giftTokens.map((gift, i) => (
                                            <MenuItem key={i} value={gift.label}>
                                                {gift.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Custom intentions and notes */}
                                <TextField
                                    placeholder="I want to express my love and commitment..."
                                    multiline
                                    rows={2.5}
                                    helperText="What’s the main intention or feeling behind this proposal?"
                                    required
                                    name='proposalIntentionNote'
                                    onChange={handleChange}
                                />
                                <TextField
                                    placeholder="Remember to mention our favorite trip or inside joke..."
                                    multiline
                                    rows={2.5}
                                    required
                                    name='proposalPrivateNote'
                                    onChange={handleChange}
                                    helperText="Any special notes or reminders for this proposal?"
                                />
                            </Stack>
                        ) : (
                            <Stack direction="column" mt={3}>
                                {/* Background music selection */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="music-type-label">Choose Music Type</InputLabel>
                                    <Select
                                        id="music-type-select"
                                        labelId="music-type-label"
                                        label="Choose Music Type"
                                        name="proposalMusictype"
                                        onChange={(e) => {
                                            handleChange(e);
                                            setMusicPage(1);
                                        }}
                                    >
                                        {proposalAudioOptions.map((audio, i) => (
                                            <MenuItem key={i} value={audio.label}>
                                                {audio.type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        Select a music style to unlock matching background tracks 🎵
                                    </FormHelperText>
                                </FormControl>

                                {/* Paginated audio tracks */}
                                {proposalMusic.length > 0 &&
                                    proposalMusic
                                        .slice((musicPage - 1) * 3, musicPage * 3) // show 5 per page
                                        .map((music, i) => (
                                            <Box key={i}
                                                sx={{
                                                    mb: 1,
                                                    boxShadow: `inset 0 0 1rem ${theme.palette.success.main}`,
                                                    borderRadius: 2,
                                                    transition: 'all 0.3s ease-in-out',
                                                    ':hover': {
                                                        boxShadow: ` 0 0 1rem ${theme.palette.success.main}`,
                                                        transform: 'scale(1.04) translateX(8px)'
                                                    }
                                                }}>
                                                <audio
                                                    src={music.previewUrl}
                                                    aria-label={`${music.artistName} - ${music.trackName} music track`}
                                                    controls
                                                    style={{ width: '100%' }}
                                                >
                                                    Your browser does not support audio playback!
                                                </audio>
                                            </Box>
                                        ))}

                                {/* Pagination */}
                                {proposalMusic.length > 5 && (
                                    <Pagination
                                        count={Math.ceil(proposalMusic.length / 5)}
                                        page={musicPage}
                                        onChange={(e, value) => setMusicPage(value)}
                                        renderItem={(item) => (
                                            <PaginationItem
                                                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                                {...item}
                                            />
                                        )}
                                        sx={{ mt: 2 }}
                                    />
                                )}

                                {/* Preview, Send buttons */}
                                <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => setPreview(true)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            borderRadius: 2,
                                            boxShadow: 'none',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'primary.light',
                                                transform: 'scale(1.05)',
                                                boxShadow: 2,
                                            },
                                        }}
                                    >
                                        Preview
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled='true'
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            borderRadius: 2,
                                            boxShadow: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                                transform: 'scale(1.05)',
                                                boxShadow: 6,
                                            },
                                        }}
                                    >
                                        Send Proposal
                                    </Button>
                                </Stack>
                            </Stack>
                        )}

                        {/* Arrow navigation buttons */}
                        <Stack flex={1} direction={'row'} justifyContent={'space-evenly'} mt={page === 3 ? 8 : 2}>
                            {/* Previous button */}
                            <Tooltip title="Previous" arrow onClick={() => setPage((prev) => prev - 1)}>
                                <IconButton
                                    sx={{
                                        p: 1.2,
                                        borderRadius: 2,
                                        filter: `drop-shadow(0 0 0.5rem ${theme.palette.primary.main})`,
                                        color: 'primary.contrastText',
                                        backgroundColor: 'primary.main',
                                        transition: 'all 0.3s ease',
                                        boxShadow: 1,
                                        '&:hover': {
                                            transform: 'translateX(-5px) scale(1.1)',
                                            boxShadow: `inset 0 0 1rem ${theme.palette.primary.main}`,
                                            filter: `drop-shadow(0 0 1rem ${theme.palette.primary.main})`,
                                        },
                                    }}
                                >
                                    <ArrowBackIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>

                            {/* Next button */}
                            <Tooltip title="Next" arrow onClick={() => setPage((prev) => prev + 1)}>
                                <IconButton
                                    sx={{
                                        p: 1.2,
                                        borderRadius: 2,
                                        filter: `drop-shadow(0 0 0.5rem ${theme.palette.primary.main})`,
                                        color: 'primary.contrastText',
                                        backgroundColor: 'primary.main',
                                        transition: 'all 0.3s ease',
                                        boxShadow: 1,
                                        '&:hover': {
                                            transform: 'translateX(-5px) scale(1.1)',
                                            boxShadow: `inset 0 0 1rem ${theme.palette.primary.main}`,
                                            filter: `drop-shadow(0 0 1rem ${theme.palette.primary.main})`,
                                        },
                                    }}
                                >
                                    <ArrowForwardIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>
                </Box>
            )}
        </Modal>

    )
}

export default ProposeToPartnerModel;
