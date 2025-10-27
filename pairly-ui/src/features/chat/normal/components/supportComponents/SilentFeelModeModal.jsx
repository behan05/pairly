import { useState } from 'react';
import { Modal, Box, Typography, Button, Stack, useTheme, CircularProgress } from '@/MUI/MuiComponents';
import { socket } from '@/services/socket';

function SilentFeelModeModel({ open, onClose, partner, partnerId }) {
  const theme = useTheme();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleClose = () => {
    setIsSending(false);
    setIsSent(false);
    onClose();
  };

  const handleSendRequest = () => {
    setIsSending(true);

    // socket event 
    // socket.emit('silent:request', { to: partnerId }, () => {
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
      aria-labelledby="silent-mode-modal"
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
              id="silent-mode-modal"
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{
                color: theme.palette.warning.main,
                letterSpacing: 0.3,
              }}
            >
              Activate Silent Feel Mode?
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              In <strong>Silent Feel Mode</strong>, you and{' '}
              <strong>{partner?.fullName || 'your partner'}</strong> can stay
              connected quietly — no messages, just presence and peace. 🌙  
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
              Request Sent! ✨
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Waiting for <strong>{partner?.fullName || 'your partner'}</strong>{' '}
              to accept your Silent Feel Mode request.
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
    </Modal>
  );
}

export default SilentFeelModeModel;
