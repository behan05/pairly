import { Dialog, DialogTitle, DialogContent, useTheme, DialogActions, Button, Typography } from '@/MUI/MuiComponents';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

const LimitReachedModal = ({ open, onClose, type }) => {
    const nativate = useNavigate();
    const theme = useTheme();

    const isTextLimit = type === 'text';
    const limitMessage = isTextLimit
        ? 'You’ve reached your 100 text message limit for today.'
        : 'You’ve reached your 5 media upload limit for today.';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
            sx: {
                borderRadius: 2,
                p: 3,
                maxWidth: 400,
                boxShadow:
                    '0 20px 30px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.05)',
                borderColor: alpha(theme.palette.warning.main, 0.4),
                background: `radial-gradient(circle at 30% 0%, ${alpha(
                    theme.palette.info.main,
                    0.9
                )} 0%, ${theme.palette.background.paper} 50%)`,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',

                '&:hover': {
                    transform: 'translateX(5px) scale(1.01)',
                }
            },
        }}>
            <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
                Daily Limit Reached
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                <Typography sx={{ mb: 2 }}>
                    {limitMessage}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Upgrade your plan to unlock unlimited messaging and media sharing.
                </Typography>
            </DialogContent>
            {/* Actions */}
            <DialogActions
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 3,
                    pb: 2,
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        borderColor: theme.palette.divider,
                        '&:hover': {
                            background: theme.palette.action.hover,
                        },
                    }}
                >
                    Maybe Later
                </Button>

                <Button
                    onClick={() => {
                        onClose();
                        nativate('/pairly/settings/premium');
                    }}
                    variant="contained"
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 1.2,
                        background: 'linear-gradient(135deg, #FFD700, #FFB300)',
                        color: '#000',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #FFB300, #FFD700)',
                            boxShadow: '0 5px 15px rgba(255,193,7,0.4)',
                        },
                    }}
                >
                    Upgrade Now
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LimitReachedModal;
