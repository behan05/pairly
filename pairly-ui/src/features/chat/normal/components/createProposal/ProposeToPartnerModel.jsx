import { useEffect, useMemo, useState } from 'react';
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
    Pagination,
    PaginationItem,
    Button,
    Checkbox
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
import { useDispatch, useSelector } from 'react-redux';
import { getMusicBySelectType } from '@/redux/slices/privateChat/privateChatAction';
import { setProposalSelectedMusic, setProposalData } from '@/redux/slices/privateChat/privateChatSlice';
import ProposalPreview from './ProposalPreview';
import ProposalLottie from './ProposalLottieAnimation';

function ProposeToPartnerModel({ open, onClose, partnerId }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { allUsers, proposalMusic } = useSelector(state => state.privateChat);
    const { profileData } = useSelector(state => state.profile);
    const { plan, status } = useSelector((state) => state?.auth?.user?.subscription || {});
    const hasPremiumAccess = plan !== 'free' && status === 'active';
    const isFreeUser = !hasPremiumAccess;
    
    const myProfile = {
        profileImage: profileData?.profileImage,
        fullName: profileData?.fullName?.split(' ')[0],
    };

    const partnerProfileData = useMemo(() => {
        return allUsers.find((p) => p.userId === partnerId)?.profile || null;
    }, [allUsers, partnerId]);

    const showProfilePic = useMemo(() => {
        return allUsers.find((p) => p.userId === partnerId)?.settings?.showProfilePic || false;
    }, [allUsers, partnerId]);

    const partnerProfile = {
        profileImage: partnerProfileData?.profileImage,
        fullName: partnerProfileData?.fullName?.split(' ')[0],
    };

    const [formData, setFormData] = useState({
        proposalType: '',
        proposalMessage: '',
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
    const [musicPage, setMusicPage] = useState(1);

    // Generate initial random message
    useEffect(() => {
        handleRandomMessage();
    }, []);

    const handleRandomMessage = () => {
        const newMessage = proposeMessages[Math.floor(Math.random() * proposeMessages.length)];
        setGenerateRandomMessage(newMessage);
        setFormData(prev => ({ ...prev, proposalMessage: newMessage }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'proposalMusictype') {
            dispatch(getMusicBySelectType(value));
            setMusicPage(1);
        }
    };

    const handleClose = () => {
        onClose();
        setPreview(false);
    };

    const handlePreview = () => {
        dispatch(setProposalData(formData));
        setPreview(true);
    };

    const maxPage = 3; // 0-3 pages
    useEffect(() => {
        if (page > maxPage) setPage(0);
        else if (page < 0) setPage(maxPage);
    }, [page]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropProps={{
                timeout: 500,
                sx: {
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
                    onClose={() => setPreview(false)}
                />
            ) : (
                <Box
                    sx={{
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
                    {/* Profile & Lottie */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {myProfile.profileImage && (
                            <Box
                                component="img"
                                src={myProfile.profileImage}
                                alt="My Profile"
                                className="float-pulse-my"
                                sx={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: `3px solid ${theme.palette.primary.main}`,
                                    boxShadow: `0 0 25px ${theme.palette.primary.main}55`,
                                    transition: 'all 0.4s ease',
                                }}
                            />
                        )}
                        <Box sx={{ width: 70, height: 70 }}>
                            <ProposalLottie />
                        </Box>
                        {partnerProfile && (
                            <Box
                                component="img"
                                src={showProfilePic ? partnerProfile?.profileImage : defaultAvatar}
                                alt="Partner Profile"
                                className="float-pulse-partner"
                                sx={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: `3px solid ${theme.palette.primary.main}`,
                                    boxShadow: `0 0 25px ${theme.palette.primary.main}55`,
                                    transition: 'all 0.4s ease',
                                }}
                            />
                        )}
                    </Box>

                    {/* Names */}
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', textShadow: `0 0 6px ${theme.palette.primary.main}33`, letterSpacing: 0.5 }}>
                            {myProfile.fullName}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', textShadow: `0 0 6px ${theme.palette.secondary.main}33`, letterSpacing: 0.5 }}>
                            {partnerProfile.fullName}
                        </Typography>
                    </Stack>

                    {/* Form Pages */}
                    <Box component="form" sx={{ width: '100%' }}>
                        <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
                            Create a memorable moment! ✨💖
                        </Typography>

                        {page === 0 && (
                            <Stack gap={1.5}>
                                <FormControl fullWidth required>
                                    <InputLabel id="proposal-type-label">Proposal Type</InputLabel>
                                    <Select
                                        labelId="proposal-type-label"
                                        id="proposal-type-select"
                                        name="proposalType"
                                        value={formData.proposalType}
                                        onChange={handleChange}
                                        label="Proposal Type"
                                    >
                                        {proposeTypes.map((type, i) => (
                                            <MenuItem key={i} value={type.label}>{type.type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={formData.proposalMessage}
                                    name="proposalMessage"
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip title="Change Message" arrow>
                                                <IconButton size="small" onClick={handleRandomMessage}>
                                                    <RefreshIcon fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Stack>
                        )}

                        {page === 1 && (
                            <Stack gap={1.5}>
                                <FormControl fullWidth>
                                    <InputLabel>Proposal Theme</InputLabel>
                                    <Select name="proposalThemes" label="Proposal Theme" value={formData.proposalThemes} onChange={handleChange}>
                                        {proposalThemes.map((theme, i) => (
                                            <MenuItem key={i} value={theme.label}>{theme.type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Background</InputLabel>
                                    <Select name="proposalBackground" label='Background' value={formData.proposalBackground} onChange={handleChange}>
                                        {backgroundOptions.map((bg, i) => (
                                            <MenuItem key={i} value={bg.label}>{bg.type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Animation Style</InputLabel>
                                    <Select name="proposalAnimationStyle" label='Animation Style' value={formData.proposalAnimationStyle} onChange={handleChange}>
                                        {animationStyles.map((anim, i) => (
                                            <MenuItem key={i} value={anim.label}>{anim.type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        )}

                        {page === 2 && (
                            <Stack gap={1.5}>
                                <FormControl fullWidth>
                                    <InputLabel>Gift Tokens</InputLabel>
                                    <Select name="proposalGiftToken" label='Gift Tokens' value={formData.proposalGiftToken} onChange={handleChange}>
                                        {giftTokens.map((gift, i) => (
                                            <MenuItem key={i} value={gift.label}>{gift.type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    placeholder="Main intention..."
                                    multiline rows={2.5}
                                    name="proposalIntentionNote"
                                    value={formData.proposalIntentionNote}
                                    onChange={handleChange}
                                    helperText="Main feeling behind this proposal."
                                />
                                <TextField
                                    placeholder="Private note..."
                                    multiline rows={2.5}
                                    name="proposalPrivateNote"
                                    value={formData.proposalPrivateNote}
                                    onChange={handleChange}
                                    helperText="Any special notes for this proposal."
                                />
                            </Stack>
                        )}

                        {page === 3 && (
                            <Stack direction="column" mt={3} gap={1.5}>
                                {/* Music Type Dropdown */}
                                <FormControl fullWidth>
                                    <InputLabel id="music-type-label">Choose Music Type</InputLabel>
                                    <Select
                                        labelId="music-type-label"
                                        label='Choose Music Type'
                                        value={formData.proposalMusictype || ''}
                                        name="proposalMusictype"
                                        onChange={(e) => {
                                            handleChange(e);
                                            setMusicPage(1);
                                        }}
                                    >
                                        {proposalAudioOptions.map((audio, i) => (
                                            <MenuItem key={i} value={audio.label}>{audio.type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Paginated Audio Tracks */}
                                {proposalMusic.length > 0 &&
                                    proposalMusic
                                        .slice((musicPage - 1) * 3, musicPage * 3)
                                        .map((music, i) => (
                                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                <audio
                                                    src={music.previewUrl}
                                                    controls
                                                    controlsList="nodownload noplaybackrate"
                                                    style={{ width: '90%' }}
                                                />
                                                <Checkbox
                                                    checked={formData.proposalSelectedMusic === music.previewUrl}
                                                    onChange={() => {
                                                        setFormData(prev => ({ ...prev, proposalSelectedMusic: music.previewUrl }));
                                                        dispatch(setProposalSelectedMusic(music.previewUrl));
                                                    }}
                                                />
                                            </Box>
                                        ))
                                }

                                {/* Pagination */}
                                {proposalMusic.length > 3 && (
                                    <Pagination
                                        count={Math.ceil(proposalMusic.length / 3)}
                                        page={musicPage}
                                        onChange={(e, value) => setMusicPage(value)}
                                        renderItem={(item) => (
                                            <PaginationItem components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                                        )}
                                        sx={{ mt: 2 }}
                                    />
                                )}

                                {/* Preview / Send buttons */}
                                <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
                                    <Button variant="outlined" onClick={handlePreview}>Preview</Button>
                                    <Button variant="contained" disabled>Send Proposal</Button>
                                </Stack>
                            </Stack>
                        )}


                        {/* Navigation */}
                        <Stack direction="row" justifyContent="space-evenly" mt={2}>
                            <Tooltip title="Previous"><IconButton onClick={() => setPage(prev => prev - 1)}><ArrowBackIcon /></IconButton></Tooltip>
                            <Tooltip title="Next"><IconButton onClick={() => setPage(prev => prev + 1)}><ArrowForwardIcon /></IconButton></Tooltip>
                        </Stack>
                    </Box>
                </Box>
            )}
        </Modal>
    );
}

export default ProposeToPartnerModel;
