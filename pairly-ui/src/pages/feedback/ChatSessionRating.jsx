import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
  Stack,
  Divider,
  useTheme,
  TextField
} from '@/MUI/MuiComponents';
import { SendIcon } from '@/MUI/MuiIcons';
import { useState } from 'react';

function ChatSessionRating({ open, onClose }) {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    emojiRating: '',
    textbox: ''
  });

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, emojiRating: rating }));
  };

  const handleSubmit = () => {
    // TODO: integrate with API
    console.log(formData);
    onClose();
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
          background: theme.palette.background.default,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
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
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: theme.palette.text.primary, mt: 1, textAlign: 'center' }}
        >
          How was your chat experience?
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}
        >
          Let us know how your last conversation went.
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ textAlign: 'center', mt: 2 }}>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
          {[
            { emoji: '😡', label: 'Terrible' },
            { emoji: '😕', label: 'Could be better' },
            { emoji: '😐', label: 'Okay' },
            { emoji: '🙂', label: 'Good' },
            { emoji: '🤩', label: 'Loved it' }
          ].map((emoji, i) => (
            <Tooltip title={emoji.label} key={i}>
              <Typography
                onClick={() => handleStarClick(emoji.label)}
                sx={{
                  fontSize: 30,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  transform: formData.emojiRating === emoji.label ? 'scale(1.3)' : 'scale(1)',
                  animation:
                    formData.emojiRating === emoji.label
                      ? 'pop 0.6s ease-in-out infinite alternate'
                      : 'none',
                  '@keyframes pop': {
                    '0%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1.35)' },
                  },
                }}
              >
                {emoji.emoji}
              </Typography>
            </Tooltip>
          ))}
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="What made this chat good or bad?"
          value={formData.textbox}
          name="textbox"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
        />
      </DialogContent>

      <Divider sx={{ my: 2 }} />

      {/* Actions */}
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 0.2,
            py: 0.8,
            textTransform: 'none',
            fontWeight: 600,
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
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            py: 0.8,
            fontSize: "1rem",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.secondary.main})`,
            color: theme.palette.common.white,
            boxShadow: `0 5px 15px ${theme.palette.primary.main}66`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 6px 20px ${theme.palette.secondary.main}66`,
            },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChatSessionRating;
