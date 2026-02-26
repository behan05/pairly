import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Divider,
    useTheme,
    TextField
} from '@/MUI/MuiComponents';
import { StarIcon, SendIcon } from '@/MUI/MuiIcons';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { USER_FEEDBACK_API } from '@/api/config';
import { getAuthHeaders } from '@/utils/authHeaders';

function OnboardingFeedback({ open, onClose }) {
    const theme = useTheme();

    const [formData, setFormData] = useState({
        starRating: 0,
        textbox: ''
    });

    const [error, setError] = useState({});

    const handleStarClick = (rating) => {
        setFormData((prev) => ({ ...prev, starRating: rating }));
        setError((prev) => ({ ...prev, starRating: '' }));
    };

    const handleSkip = () => {
        localStorage.setItem('onboardingFeedbackSkippedAt', Date.now());
        onClose();
    };

    const handleSubmit = async () => {
        if (!formData.starRating) {
            setError((prev) => ({ ...prev, starRating: 'Please select a rating' }));
            return;
        }

        try {
            const res = await axios.post(
                USER_FEEDBACK_API,
                {
                    feedbackType: 'onboarding',
                    rating: formData.starRating,
                    message: formData.textbox
                },
                { headers: getAuthHeaders() }
            );

            if (res.data.success) {
                toast.success('Thank you for your feedback!');
                setFormData({ starRating: 0, textbox: '' });
                onClose();
                localStorage.setItem('onboardingFeedbackDoneAt', Date.now());
            } else {
                toast.error(res.data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Feedback error:', err);
            toast.error(err.response?.data?.error || 'Failed to submit feedback.');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    p: 1,
                    minWidth: 280,
                    background: theme.palette.background.paper,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    border: `1px solid ${theme.palette.divider}`
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    pb: 0,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: theme.palette.text.primary, mt: 1, textAlign: 'center' }}
                >
                    How was your setup experience?
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}
                >
                    Your feedback helps us improve your first-time experience.
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', mt: 2 }}>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={star}
                            onClick={() => handleStarClick(star)}
                            sx={{
                                fontSize: 36,
                                cursor: 'pointer',
                                transition: '0.2s',
                                color:
                                    formData.starRating >= star
                                        ? '#FFD700'
                                        : theme.palette.action.disabled,
                                '&:hover': { transform: 'scale(1.2)' },
                            }}
                        />
                    ))}
                </Stack>

                {error.starRating && (
                    <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                        {error.starRating}
                    </Typography>
                )}

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Anything we can improve during onboarding?"
                    value={formData.textbox}
                    name="textbox"
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                    }
                />
            </DialogContent>

            <Divider sx={{ my: 2 }} />

            <DialogActions
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 1,
                }}
            >
                <Button
                    onClick={handleSkip}
                    variant="outlined"
                    sx={{
                        borderRadius: 0.2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 0.8,
                        color: theme.palette.text.primary,
                        borderColor: theme.palette.divider,
                        '&:hover': { background: theme.palette.action.hover },
                    }}
                >
                    Ask Me Later
                </Button>

                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{
                        borderRadius: 0.2,
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 0.8,
                        fontSize: '1rem',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.secondary.main})`,
                        color: theme.palette.common.white,
                        boxShadow: `0 5px 15px ${theme.palette.primary.main}66`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            boxShadow: `0 6px 20px ${theme.palette.secondary.main}66`,
                        },
                    }}
                >
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default OnboardingFeedback;
