import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    useTheme,
} from '@/MUI/MuiComponents';
import { StarIcon } from '@/MUI/MuiIcons';
import { useNavigate } from 'react-router-dom';

const PremiumFeatureModal = ({
    open,
    onClose,
    featureName,
    upgradePath = '/pairly/settings/premium',
}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleUpgrade = () => {
        onClose();
        navigate(upgradePath);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 1,
                    maxWidth: 350,
                    background: theme.palette.background.default,
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    pb: 0,
                }}
            >
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #046069ff, #ffb300ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(255, 193, 7, 0.5)',
                    }}
                >
                    <StarIcon sx={{ color: 'white', fontSize: 40 }} />
                </Box>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        color: theme.palette.text.primary,
                        mt: 1,
                    }}
                >
                    Premium Feature
                </Typography>
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                    <strong>{featureName}</strong> is a Premium-only feature.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    Unlock it by upgrading your plan and enjoy exclusive tools and enhanced performance.
                </Typography>
            </DialogContent>

            <Divider sx={{ my: 2 }} />

            {/* Actions */}
            <DialogActions
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 1,
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
                    onClick={handleUpgrade}
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

export default PremiumFeatureModal;
