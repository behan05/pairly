import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useTheme } from '@/MUI/MuiComponents';
import { alpha } from '@mui/material/styles';

const AudioErrorModal = ({ open, onClose }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 3,
                    maxWidth: 400,
                    boxShadow: '0 20px 30px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.05)',
                    borderColor: alpha(theme.palette.warning.main, 0.4),
                    background: `radial-gradient(circle at 30% 0%, ${alpha(theme.palette.info.main, 0.9)} 0%, ${theme.palette.background.paper} 50%)`,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': { transform: 'translateX(5px) scale(1.01)' }
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
                Microphone Not Detected
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                <Typography sx={{ mb: 2 }}>
                    We couldn't detect a microphone on your device.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Connect a microphone and allow permission to send audio messages.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: 'center', px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1.2,
                        background: 'linear-gradient(135deg, #FF6B6B, #FF3D3D)',
                        color: '#fff',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #FF3D3D, #FF6B6B)',
                            boxShadow: '0 5px 15px rgba(255, 99, 71, 0.4)',
                        },
                    }}
                >
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AudioErrorModal;
