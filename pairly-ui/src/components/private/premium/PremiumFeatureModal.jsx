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
import { alpha } from '@mui/material/styles';
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
                    borderRadius: 4,
                    p: 3,
                    maxWidth: 400,
                    boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
                    background: alpha(theme.palette.background.paper),
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    boxShadow: '0 15px 25px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',

                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow:
                            '0 20px 30px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.05)',
                        borderColor: alpha(theme.palette.warning.main, 0.4),
                        background: `radial-gradient(circle at 30% 0%, ${alpha(
                            theme.palette.warning.main,
                            0.9
                        )} 0%, ${theme.palette.background.paper} 70%)`,
                    }
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
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FFD700, #FFB300)',
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
