import React, { useEffect, useMemo, useState } from 'react'

import {
    Box,
    Modal,
    Typography,
    TextField,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Stack,
    useTheme,
    IconButton,
    Tooltip,
    Divider,
    Button
} from '../../../../../MUI/MuiComponents';
import {
    defaultAvatar,
    CloseIcon,
    RefreshIcon,
} from '../../../../../MUI/MuiIcons';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import ProposalLottie from './ProposalLottieAnimation';
import { proposeMessages } from '@/utils/proposeMessages';

// Accessing Music via Pixabay API
import { PIXABAY_AUDIO_API } from '@/api/config';

const proposeTypes = [
    { type: "Be my life partner 💖", label: "life_partner" },
    { type: "Will you marry me? 💍", label: "forever_marry" },
    { type: "You feel like home 🏡", label: "home_forever" },
    { type: "Two souls, one heart 💓", label: "two_souls" },
    { type: "You’re my sunrise 🌅", label: "sunrise" },
    { type: "Steal my fries & heart 🍟❤️", label: "steal_fries" },
    { type: "Grow old with me 👵👴", label: "grow_old" },
    { type: "Together forever 💞", label: "together_place" },
];

const proposalThemes = [
    { type: "Romantic Glow", label: "romantic_glow" },
    { type: "Dreamy Pastel", label: "dreamy_pastel" },
    { type: "Elegant Minimal", label: "elegant_minimal" },
    { type: "Night Sky", label: "night_sky" },
    { type: "Sunset Romance", label: "sunset_romance" },
    { type: "Vintage Charm", label: "vintage_charm" },
    { type: "Magical Fantasy", label: "magical_fantasy" },
    { type: "Floral Bliss", label: "floral_bliss" },
    { type: "Modern Chic", label: "modern_chic" },
    { type: "Winter Sparkle", label: "winter_sparkle" }
];

const backgroundOptions = [
    { type: "Light", label: "light" },
    { type: "Dark", label: "dark" },
    { type: "Gradient", label: "gradient" },
    { type: "Custom Image", label: "custom_image" },
    { type: "Blur", label: "blur" },
    { type: "Starry Night", label: "starry_night" },
    { type: "Sunset", label: "sunset" },
    { type: "Floral", label: "floral" },
    { type: "Minimal Pattern", label: "minimal_pattern" },
    { type: "Winter Snow", label: "winter_snow" }
];

const animationStyles = [
    { type: "Heartbeat", label: "heartbeat" },
    { type: "Floating Particles", label: "floating_particles" },
    { type: "Glow Pulse", label: "glow_pulse" },
    { type: "Fade In/Out", label: "fade_in_out" },
    { type: "Slide From Sides", label: "slide_from_sides" },
    { type: "Sparkles", label: "sparkles" },
    { type: "Bouncing Icons", label: "bouncing_icons" },
    { type: "Slow Zoom", label: "slow_zoom" },
    { type: "Rotating Hearts", label: "rotating_hearts" },
    { type: "Twinkling Stars", label: "twinkling_stars" }
];

const giftTokens = [
    { type: "Flower 🌹", label: "flower" },
    { type: "Ring 💍", label: "ring" },
    { type: "Heart ❤️", label: "heart" },
    { type: "Star ⭐", label: "star" },
    { type: "Chocolate 🍫", label: "chocolate" },
    { type: "Teddy 🧸", label: "teddy" },
    { type: "Balloon 🎈", label: "balloon" },
    { type: "Candle 🕯️", label: "candle" },
    { type: "Gift Box 🎁", label: "gift_box" },
    { type: "Custom Emoji ✨", label: "custom_emoji" }
];

function ProposeToPartnerModel({ open, onClose, partnerId }) {

    const { allUsers } = useSelector(state => state.privateChat);
    const { profileData } = useSelector(state => state.profile);
    const myProfile = {
        profileImage: profileData?.profileImage,
        fullName: profileData?.fullName?.split(' ')[0],
    };

    const partnerProfileData = useMemo(() => {
        return allUsers.find((p) => p.userId === partnerId)?.profile || null
    }, [allUsers]);

    const showProfilePic = useMemo(() => {
        return allUsers.find((p) => p.userId === partnerId)?.settings?.showProfilePic || false
    }, [allUsers]);

    const partnerProfile = {
        profileImage: partnerProfileData?.profileImage,
        fullName: partnerProfileData?.fullName?.split(' ')[0]
    }

    const theme = useTheme();
    const [formData, setFormData] = React.useState({
        proposalType: '',
        personalMessage: '',
    });

    const [generateRandomMessage, setGenerateRandomMessage] = useState('')
    const [page, setPage] = useState(0)

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
    }, [])
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
            <Box
                sx={{
                    // Modal container styling and center positioning
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 400 },
                    bgcolor: 'background.paper',
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
                                width: 90,
                                height: 90,
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
                    <Box sx={{ width: 60, height: 60 }}>
                        <ProposalLottie />
                    </Box>

                    {/* Partner profile image */}
                    {partnerProfile && (
                        <Box
                            component="img"
                            src={showProfilePic ? partnerProfile?.profileImage : defaultAvatar}
                            alt="Partner Profile"
                            sx={{
                                width: 90,
                                height: 90,
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
                            />
                            <TextField
                                placeholder="Remember to mention our favorite trip or inside joke..."
                                multiline
                                rows={2.5}
                                required
                                helperText="Any special notes or reminders for this proposal?"
                            />
                        </Stack>
                    ) : (
                        <Stack direction="column" mt={3}>
                            {/* Background music selection */}
                            <FormControl>
                                <InputLabel id="background-music-label">Select Background Music</InputLabel>
                                <Select
                                    id="background-music-label"
                                    labelId="background-music-label"
                                    label="Select Background Music"
                                >
                                    <MenuItem>
                                        <audio
                                            controls
                                            src={''} // TODO: Pixabay audio URL
                                            style={{ width: '100%', borderRadius: 8 }}
                                        >
                                            Your browser does not support the audio element.
                                        </audio>
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {/* Preview, Edit, Send buttons */}
                            <Stack direction="rows" gap={2} justifyContent="center" mt={3}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            transform: 'scale(1.05)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Preview
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'secondary.light',
                                            transform: 'scale(1.05)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            transform: 'scale(1.05)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Send
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
                                    color: 'primary.main',
                                    backgroundColor: 'action.hover',
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: 'primary.contrastText',
                                        backgroundColor: 'primary.main',
                                        transform: 'translateX(-5px) scale(1.1)',
                                    },
                                    boxShadow: 1,
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
                                    color: 'primary.main',
                                    backgroundColor: 'action.hover',
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: 'primary.contrastText',
                                        backgroundColor: 'primary.main',
                                        transform: 'translateX(5px) scale(1.1)',
                                    },
                                    boxShadow: 1,
                                }}
                            >
                                <ArrowForwardIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            </Box>
        </Modal>

    )
}

export default ProposeToPartnerModel;
