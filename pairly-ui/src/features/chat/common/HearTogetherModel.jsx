import { useState } from 'react';
import { Modal, Box, Typography, Button, Stack, useTheme, CircularProgress } from '@/MUI/MuiComponents';
import { useSelector } from 'react-redux';
// import PremiumFeatureModel from '@/components/private/premium/PremiumFeatureModal';
import { socket } from '@/services/socket';

function HearTogherModel({ open, onClose, partner, partnerId }) {
    const theme = useTheme();
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    // const [modalOpen, setModalOpen] = useState(false);
    // const [premiumFeatureName, setPremiumFeatureName] = useState('');
    // const { plan, status } = useSelector((state) => state?.auth?.user?.subscription);
    // const isFreeUser = status === 'active' && plan === 'free';

    const handleClose = () => {
        setIsSending(false);
        setIsSent(false);
        onClose();
    };

    const handleSendRequest = () => {
        // if (isFreeUser) {
        //     setPremiumFeatureName('Hear Togher');
        //     setModalOpen(true);
        //     return;
        // }
        setIsSending(true);

        // socket event 
        // socket.emit('hearTogher:request', { to: partnerId }, () => {
        //   setTimeout(() => {
        //     setIsSending(false);
        //     setIsSent(true);
        //   }, 1000);
        // });
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="hear-together-modal"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 4,
                    maxWidth: 420,
                    width: '90%',
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                {!isSent ? (
                    <>
                        <Typography
                            id="hear-together-modal"
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                            sx={{
                                color: theme.palette.warning.main,
                                letterSpacing: 0.3,
                            }}
                        >
                            Start Hear Together Session?
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3, lineHeight: 1.6 }}
                        >
                            In <strong>Hear Together</strong>, you and{' '}
                            <strong>{partner?.fullName || 'your partner'}</strong> can listen
                            to the same music together in real time while chatting. 🎧
                            Feel the rhythm, share your vibe, and connect through music. 💫
                            <br />
                            The music will keep playing as long as the session is active — until one of you closes it manually.
                            <br />
                            We’ll send a request to your partner for confirmation.
                        </Typography>

                        <Stack direction="row" justifyContent="center" spacing={2}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
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
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                color="warning"
                                disabled={isSending}
                                onClick={handleSendRequest}
                                sx={{
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 3,
                                    py: 1.2,
                                    background: `linear-gradient(135deg, ${theme.palette.warning.main}aa, ${theme.palette.warning.main})`,
                                    color: '#000',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFB300, #FFD700)',
                                        boxShadow: '0 5px 15px rgba(255,193,7,0.4)',
                                    },
                                }}
                            >
                                {isSending ? <CircularProgress size={22} color="inherit" /> : 'Send Request'}
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="success.main"
                            gutterBottom
                        >
                            Request Sent! 🎶
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Waiting for <strong>{partner?.fullName || 'your partner'}</strong>{' '}
                            to accept your <strong>HearTogether</strong> request.
                            Once accepted, you’ll both enjoy the same music in sync — until either of you ends the session manually. 💙
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                            }}
                        >
                            Close
                        </Button>
                    </>
                )}
            </Box>

            {/* <PremiumFeatureModel
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                featureName={premiumFeatureName}
            /> */}
        </Modal>
    );
}

export default HearTogherModel;
