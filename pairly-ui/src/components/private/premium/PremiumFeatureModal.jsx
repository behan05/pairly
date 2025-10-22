import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@/MUI/MuiComponents';
import { useNavigate } from 'react-router-dom';

const PremiumFeatureModal = ({ open, onClose, featureName, upgradePath = '/pairly/settings/premium' }) => {
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
                    borderRadius: 3,
                    p: 2,
                    minWidth: 300,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    background: (theme) => theme.palette.background.paper,
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    color: (theme) => theme.palette.primary.main,
                    textAlign: 'center',
                }}
            >
                Premium Feature
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        textAlign="center"
                    >
                        <strong>{featureName}</strong> is only available for Premium users.<br />
                        Upgrade to unlock this feature and enjoy more benefits.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{ display: 'flex', justifyContent: 'space-between', px: 3, pb: 2 }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: (theme) => theme.palette.text.primary,
                        borderColor: (theme) => theme.palette.divider,
                        '&:hover': { background: 'rgba(0,0,0,0.04)' },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleUpgrade}
                    variant="contained"
                    sx={(theme) => ({
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        color: theme.palette.getContrastText(theme.palette.primary.main),
                        '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                            boxShadow: `0 5px 15px ${theme.palette.primary.main}40`,
                        },
                    })}
                >Upgrade</Button>

            </DialogActions>
        </Dialog>
    );
};

export default PremiumFeatureModal;
