import { useState } from 'react';
import {
  Modal,
  Stack,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  useTheme,
  useMediaQuery,
  FormHelperText
} from '@/MUI/MuiComponents';
import { BlockIcon } from '@/MUI/MuiIcons';

// components
import BlurWrapper from '@/components/common/BlurWrapper';
import StyledText from '@/components/common/StyledText';

// redux
import { blockUser } from '@/redux/slices/moderation/blockUserAction';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '@/services/socket';

// Toast notifications
import { toast } from 'react-toastify';

function BlockUserModal({ open, onClose, partner, partnerId }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    reason: '',
    customReason: '',
  });
  const [error, setError] = useState({
    reason: '',
    customReason: '',
  })
  const { isBlocking } = useSelector(state => state.moderation);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formData.reason.trim() !== '') {
      setError((prev) => (
        { ...prev, reason: '' }
      ));
    }
  };

  const handleCancel = () => {
    onClose();
    setFormData({
      reason: '',
      customReason: '',
    });
    setError({
      reason: '',
      customReason: '',
    });
  }

  const handleBlockConfirm = async () => {
    if (formData.reason === 'other' && formData.customReason.trim().length < 10) {
      setError((prev) => (
        { ...prev, customReason: 'Please provide a meaningful explanation for selecting "Other" (min 10 characters).' }
      ))
      return;
    }

    if (formData.reason.trim() === '') {
      setError((prev) => (
        { ...prev, reason: 'Blocking reason is required.' }
      ));
      return;
    }

    const payload = {
      ...formData,
      blockPartnerSocketId: partnerId,
    };

    try {
      const response = await dispatch(blockUser(payload));

      if (response?.success) {
        toast.success(response.message || 'User blocked successfully');
        onClose();
        socket.emit('random:disconnect');
        setFormData({
          reason: '',
          customReason: '',
        });
      } else {
        toast.error(response?.error);
        onClose();
        setFormData({
          reason: '',
          customReason: '',
        });
      }
    } catch (_) {
      return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="block-user-modal"
      aria-describedby="block-user-description"
      sx={{ mt: 10, px: isSm ? 2 : 4 }}
    >
      <BlurWrapper>
        <Typography variant="body1">
          Block <StyledText text={partner?.fullName} />
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
          Are you sure you want to block <strong>{partner?.fullName}</strong>? You will no longer be able to send or receive messages from this user.
        </Typography>

        <FormControl fullWidth margin="normal" error={Boolean(error.reason)}>
          <InputLabel id="blockReason-label">Block Reason</InputLabel>
          <Select
            labelId="blockReason-label"
            id="reason"
            name="reason"
            label="Block Reason"
            value={formData.reason}
            onChange={handleChange}
          >
            <MenuItem value="inappropriate_messages">Inappropriate Messages</MenuItem>
            <MenuItem value="spam_or_advertising">Spam or Advertising</MenuItem>
            <MenuItem value="harassment_or_bullying">Harassment or Bullying</MenuItem>
            <MenuItem value="offensive_content">Offensive Content</MenuItem>
            <MenuItem value="fake_profile">Fake Profile</MenuItem>
            <MenuItem value="unwanted_contact">Unwanted Contact</MenuItem>
            <MenuItem value="scam_or_fraud">Scam or Fraud</MenuItem>
            <MenuItem value="privacy_concerns">Privacy Concerns</MenuItem>
            <MenuItem value="hate_speech_or_threats">Hate Speech or Threats</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          {error.reason && <FormHelperText>{error.reason}</FormHelperText>}
        </FormControl>

        {formData.reason === 'other' && (
          <TextField
            label="Please specify a valid reason"
            name="customReason"
            value={formData.customReason}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            placeholder="E.g., user violated guidelines by sending inappropriate messages."
            margin="normal"
            error={Boolean(error.customReason)}
            helperText={error.customReason}
          />
        )}

        <Stack
          direction="row"
          spacing={1}
          mt={3}
          flexWrap={isXs ? 'wrap' : 'nowrap'}
        >
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleBlockConfirm}
            endIcon={<BlockIcon fontSize="small" />}
          >
            {isBlocking ? 'Blocking....' : 'Block'}
          </Button>
        </Stack>
      </BlurWrapper>
    </Modal>
  );
}

export default BlockUserModal;
