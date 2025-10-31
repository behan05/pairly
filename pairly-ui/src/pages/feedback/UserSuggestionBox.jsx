import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Stack, Divider, TextField,
  MenuItem, useTheme, Select, FormControl
} from '../../MUI/MuiComponents';
import { SendIcon } from '../../MUI/MuiIcons';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { USER_FEEDBACK_API } from '@/api/config';
import { getAuthHeaders } from '@/utils/authHeaders';

function UserSuggestionBox({ open, onClose }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    suggestion: '',
    priority: 'Medium priority'
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError({});
  };

  const handleSubmit = async () => {
    if (!formData.suggestion.trim()) {
      setError({ suggestion: 'Please write your suggestion before submitting.' });
      return;
    }

    try {

      const res = await axios.post(USER_FEEDBACK_API, {
        feedbackType: 'suggestion',
        message: formData.suggestion,
        priority: formData.priority,
      },
        { headers: getAuthHeaders() }
      );

      if (res.data.success) {
        toast.success('Thank you for your suggestion!');
        setFormData({ suggestion: '', priority: 'Medium priority' });
        onClose();
      }
    } catch (err) {
      console.error('Suggestion error:', err);
      toast.error(err.response?.data?.error || 'Failed to submit suggestion. Please try again.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 1,
          p: 2,
          minWidth: 320,
          background: theme.palette.background.paper,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
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
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.info.light}, ${theme.palette.primary.main})`,
            boxShadow: `0 4px 10px ${theme.palette.info.main}66`,
          }}
        >
          <LightbulbIcon sx={{ color: '#fff', fontSize: 32 }} />
        </Stack>

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: theme.palette.text.primary, textAlign: 'center', mt: 1 }}
        >
          Have a suggestion for us?
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}
        >
          We’d love to hear your ideas for new features or improvements.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Share your idea or feature suggestion"
            name="suggestion"
            value={formData.suggestion}
            onChange={handleChange}
            multiline
            minRows={3}
            error={!!error.suggestion}
            helperText={error.suggestion}
          />

          <FormControl fullWidth>
            <Typography
              variant="body2"
              sx={{ mb: 0.5, color: theme.palette.text.secondary }}
            >
              How important is this to you?
            </Typography>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {['Low priority', 'Medium priority', 'High priority'].map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <Divider sx={{ my: 2 }} />

      <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 0.2,
            textTransform: 'none',
            fontWeight: 600,
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            '&:hover': { background: theme.palette.action.hover },
          }}
        >
          Later
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
            py: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.secondary.main})`,
            color: theme.palette.common.white,
            boxShadow: `0 5px 15px ${theme.palette.primary.main}66`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          Submit Suggestion
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserSuggestionBox;
