import { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Button,
    Stack,
    useTheme,
    Avatar,
    Paper,
    Divider,
    Alert
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import { useSelector } from 'react-redux';

const avatars = [
    '/avatars/clown.png',
    '/avatars/mic.png',
    '/avatars/smile.png',
    '/avatars/laugh.png',
];

function CreateEvent() {
    const theme = useTheme();
    const { plan, status } = useSelector((state) => state?.auth?.user?.subscription || {});
    const isFreeUser = status === 'active' && plan === 'free';

    const [eventData, setEventData] = useState({
        title: '',
        dateTime: '',
        avatar: avatars[0],
    });

    const handleChange = (field) => (e) => {
        setEventData({ ...eventData, [field]: e.target.value });
    };

    const handleCreateEvent = () => {
        if (isFreeUser) return;
        console.log('Event Created:', eventData);
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: 'auto',
                p: 4,
                mt: 3,
                backgroundColor: 'background.paper',
                borderRadius: 3,
                boxShadow: theme.shadows[5],
            }}
        >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <CelebrationIcon sx={{ fontSize: 30, color: theme.palette.secondary.main }} />
                <Typography variant="h5" fontWeight={700}>
                    Create Standup Event 🎤
                </Typography>
            </Stack>

            {/* Premium Notice */}
            {isFreeUser && (
                <Alert severity="warning" icon={<LockIcon />}>
                    This is a <strong>Premium Feature</strong>. Upgrade your plan to create standup events and earn money.
                </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Event Form */}
            <Stack spacing={2}>
                <TextField
                    label="Event Title"
                    value={eventData.title}
                    onChange={handleChange('title')}
                    fullWidth
                    required
                />

                <TextField
                    label="Event Date & Time"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={eventData.dateTime}
                    onChange={handleChange('dateTime')}
                    fullWidth
                    required
                />

                {/* Avatar Selection */}
                <Typography variant="subtitle1" mt={1}>
                    Choose Your Avatar:
                </Typography>

                <Stack direction="row" spacing={2}>
                    {avatars.map((src, index) => (
                        <Avatar
                            key={index}
                            src={src}
                            sx={{
                                width: 60,
                                height: 60,
                                border: eventData.avatar === src ? `3px solid ${theme.palette.primary.main}` : '2px solid transparent',
                                cursor: 'pointer',
                                transition: '0.3s',
                                '&:hover': { transform: 'scale(1.05)' },
                            }}
                            onClick={() => setEventData({ ...eventData, avatar: src })}
                        />
                    ))}
                </Stack>

                {/* Preview */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mt: 2,
                        textAlign: 'center',
                        borderRadius: 2,
                        background: theme.palette.action.hover,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={600}>
                        Event Preview:
                    </Typography>
                    <Avatar
                        src={eventData.avatar}
                        sx={{ width: 70, height: 70, mx: 'auto', my: 1 }}
                    />
                    <Typography variant="h6">{eventData.title || 'Untitled Event'}</Typography>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                            {eventData.dateTime
                                ? new Date(eventData.dateTime).toLocaleString()
                                : 'No time selected'}
                        </Typography>
                    </Stack>
                </Paper>

                {/* Create Button */}
                <Button
                    variant="contained"
                    fullWidth
                    disabled={!eventData.title || !eventData.dateTime || isFreeUser}
                    onClick={handleCreateEvent}
                    sx={{
                        mt: 2,
                        py: 1.3,
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                    }}
                >
                    {isFreeUser ? 'Upgrade to Unlock 🚀' : 'Create Event'}
                </Button>
            </Stack>

            {/* Terms */}
            <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2, color: 'text.secondary' }}>
                By creating an event, you agree to our platform’s <strong>Terms & Conditions</strong>.
            </Typography>
        </Box>
    );
}

export default CreateEvent;
