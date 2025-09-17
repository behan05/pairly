import React from 'react'

// ------------------------------------ Options overview -------------------------------
/**
 * @Select Proposal type
 * 1 - Be my love
 * 2 - Be my life partner
 * 3 - Be best friend
 * 4 - Have fun with me
 * 5 - Be a gaming partner
 * 6 - can you maintain long-distance relationship
 * 
 * @Write Personl message or your feelings
 * 
 * @Choose theme/style
 * 
 * @Pick backgroud
 * 1 - Romantic
 * 2 - fun
 * 3 - elegant
 * 4 - casual
 * 5 - choose from local device (your own background)
 * 
 * @Select Cake/Gift
 * Added different variant or varity
 * 
 * @Add background music/sound effect
 *  
 * @Preview proposal (Allow all edit to options)
 * 
 */

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
} from '../../../../../MUI/MuiComponents';
import {
    defaultAvatar,
    CloseIcon,
} from '../../../../../MUI/MuiIcons';

const backgroundOptions = {
    romantic: [
        { id: "rom1", src: "https://picsum.photos/id/237/300/200" },
        { id: "rom2", src: "https://picsum.photos/id/238/300/200" },
        { id: "rom3", src: "https://picsum.photos/id/239/300/200" },
    ],
    fun: [
        { id: "fun1", src: "https://picsum.photos/id/240/300/200" },
        { id: "fun2", src: "https://picsum.photos/id/241/300/200" },
    ],
    elegant: [
        { id: "eleg1", src: "https://picsum.photos/id/242/300/200" },
        { id: "eleg2", src: "https://picsum.photos/id/243/300/200" },
    ],
    casual: [
        { id: "cas1", src: "https://picsum.photos/id/244/300/200" },
        { id: "cas2", src: "https://picsum.photos/id/245/300/200" },
    ],
    gaming: [
        { id: "game1", src: "https://picsum.photos/id/246/300/200" },
        { id: "game2", src: "https://picsum.photos/id/247/300/200" },
    ],
};

const giftOptions = [
    { id: "cake1", src: "https://picsum.photos/id/250/200/200", label: "Cake" },
    { id: "gift1", src: "https://picsum.photos/id/251/200/200", label: "Gift Box" },
    { id: "ring1", src: "https://picsum.photos/id/252/200/200", label: "Ring" },
];

const musicOptions = {
    romantic_piano: [
        { id: "track1", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { id: "track2", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { id: "track3", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    ],
    fun_party_beat: [
        { id: "track4", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { id: "track5", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { id: "track6", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    ],
    elegant_string: [
        { id: "track7", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
        { id: "track8", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
        { id: "track9", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    ],
    casual_chill_vibes: [
        { id: "track10", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
        { id: "track11", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
        { id: "track12", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    ],
    gaming_electron: [
        { id: "track13", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
        { id: "track14", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
        { id: "track15", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    ],
};

function ProposeToPartnerModel({ open, onClose }) {
    const theme = useTheme();
    const [formData, setFormData] = React.useState({
        proposalType: '',
        personalMessage: '',
        theme: '',
        background: '',
        gift: '',
        music: '',
    });

    const handleClose = () => {
        onClose()
    }
    return (
        <Modal open={open} onClose={handleClose}>
            <Box component={'form'} sx={{
                maxWidth: 800,
                overflowY: 'auto',
                maxHeight: '80vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 1,
                mx: 'auto',
                mt: 10,
                position: 'relative',
            }}>
                {/* Close Button */}
                <IconButton
                    onClick={handleClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h4" color='text.main'>
                    Create Your Personalized Proposal (under development)
                </Typography>

                {/* Proposal Type */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="proposal-type-label">Proposal Type</InputLabel>
                    <Select
                        labelId="proposal-type-label"
                        id="proposal-type"
                        value={formData.proposalType}
                        label="Proposal Type"
                        onChange={(e) => setFormData({ ...formData, proposalType: e.target.value })}
                    >
                        <MenuItem value='love'>Be my love</MenuItem>
                        <MenuItem value='life_partner'>Be my life partner</MenuItem>
                        <MenuItem value='best_friend'>Be best friend</MenuItem>
                        <MenuItem value='have_fun'>Have fun with me</MenuItem>
                        <MenuItem value='gaming_partner'>Be a gaming partner</MenuItem>
                        <MenuItem value='long_distance'>Long distance relationship</MenuItem>
                    </Select>
                </FormControl>

                {/* input field for personal message */}
                <TextField
                    label="Attach a personal message"
                    name="personalMessage"
                    multiline
                    rows={4}
                    fullWidth
                    placeholder='Write your feelings or message here...'
                    variant="outlined"
                    sx={{ mt: 2 }}
                />

                {/* Theme/Style selection */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="theme-style-label">Choose Theme/Style</InputLabel>
                    <Select
                        labelId="theme-style-label"
                        id="theme-style"
                        value={formData.theme}
                        label="Choose Theme/Style"
                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    >
                        <MenuItem value="romantic">Romantic</MenuItem>
                        <MenuItem value="elegant">Elegant</MenuItem>
                        <MenuItem value="casual">Casual</MenuItem>
                        <MenuItem value="fun">Fun</MenuItem>
                        <MenuItem value="gaming">Gaming</MenuItem>
                    </Select>
                </FormControl>

                {formData.theme && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Choose Background</Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
                            {backgroundOptions[formData.theme]?.map((bg) => (
                                <Box
                                    key={bg.id}
                                    sx={{
                                        width: 100,
                                        height: 80,
                                        borderRadius: 1,
                                        overflow: "hidden",
                                        p: 1,
                                    }}
                                >
                                    <img
                                        src={bg.src}
                                        alt={bg.id}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/*  Cake/Gift */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Choose a Cake/Gift</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
                        {giftOptions.map((gift) => (
                            <Box
                                key={gift.id}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 1,
                                    p: 1,
                                }}
                            >
                                <img
                                    src={gift.src}
                                    alt={gift.label}
                                    style={{ width: "100%", height: "70%", objectFit: "cover" }}
                                />
                                <Typography variant="caption">{gift.label}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {/* Background Music */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="theme-music-label">Choose Background Music</InputLabel>
                    <Select
                        labelId="theme-music-label"
                        id="theme-music"
                        value={formData.music}
                        label="Choose Background Music"
                        onChange={(e) => setFormData({ ...formData, music: e.target.value })}
                    >
                        <MenuItem value="romantic_piano">Romantic Piano</MenuItem>
                        <MenuItem value="fun_party_beat">Fun Party Beat</MenuItem>
                        <MenuItem value="elegant_string">Elegant String</MenuItem>
                        <MenuItem value="casual_chill_vibes">Casual Chill Vibes</MenuItem>
                        <MenuItem value="gaming_electron">Gaming Electron</MenuItem>
                    </Select>
                </FormControl>

                {formData.music && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Choose Background Music</Typography>
                        <Stack
                            spacing={2}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 1,
                                p: 1,
                            }}
                        >
                            {musicOptions[formData.music]?.map((track) => (
                                <Box
                                    key={track.id}
                                    sx={{
                                        p: 1,
                                        cursor: "pointer",
                                        maxWidth: 260,
                                        bgcolor: "background.paper",
                                        flex: "1 1 220px",
                                        boxShadow: `inset 0 2px 8px ${theme.palette.divider}`,
                                        borderRadius: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Typography fontWeight="500" gutterBottom>
                                        {track.name}
                                    </Typography>
                                    <audio controls style={{ width: "100%" }}>
                                        <source src={track.src} type="audio/mpeg" />
                                        Your browser does not support the audio tag.
                                    </audio>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Modal>
    )
}

export default ProposeToPartnerModel;
