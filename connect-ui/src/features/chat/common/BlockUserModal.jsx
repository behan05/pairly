/**
 * @file BlockUserModal.jsx
 * @description
 * A modal component that allows the current user to block another user (partner) during a chat.
 * The modal prompts for a reason (predefined list or custom) before confirming the block.
 * Upon confirmation, the block request is sent via Redux action and the chat is disconnected using Socket.IO.
 *
 * @component
 * @param {boolean} open - Controls whether the modal is open or closed.
 * @param {Function} onClose - Callback to close the modal.
 * @param {Object} partner - The partner user's data (e.g., fullName).
 * @param {string} partnerId - The partner's socket ID for real-time disconnect.
 *
 * @requires react
 * @requires @mui/material
 * @requires react-redux
 * @requires socket.io-client
 * @requires react-toastify
 *
 * @example
 * <BlockUserModal
 *   open={isModalOpen}
 *   onClose={handleCloseModal}
 *   partner={selectedUser}
 *   partnerId={selectedUserSocketId}
 * />
 */

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

  // Form state
  const [formData, setFormData] = useState({
    reason: '',
    customReason: ''
  });

  // Error state for form validation
  const [error, setError] = useState({
    reason: '',
    customReason: ''
  });

  // Redux state for loading
  const { isBlocking } = useSelector((state) => state.moderation);

  /**
   * Handle input change for form fields
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear reason error if user selects a reason
    if (name === 'reason' && value.trim() !== '') {
      setError((prev) => ({ ...prev, reason: '' }));
    }
  };

  /**
   * Handle modal cancel and reset state
   */
  const handleCancel = () => {
    onClose();
    setFormData({ reason: '', customReason: '' });
    setError({ reason: '', customReason: '' });
  };

  /**
   * Handle block confirmation and trigger API call
   */
  const handleBlockConfirm = async () => {
    // If reason is 'other', ensure customReason has at least 10 chars
    if (formData.reason === 'other' && formData.customReason.trim().length < 10) {
      setError((prev) => ({
        ...prev,
        customReason:
          'Please provide a meaningful explanation for selecting "Other" (min 10 characters).'
      }));
      return;
    }

    // If no reason selected, set error
    if (formData.reason.trim() === '') {
      setError((prev) => ({ ...prev, reason: 'Blocking reason is required.' }));
      return;
    }

    // Payload for API call
    const payload = {
      ...formData,
      blockPartnerSocketId: partnerId
    };

    try {
      const response = await dispatch(blockUser(payload));

      if (response?.success) {
        toast.success(response.message || 'User blocked successfully');
        onClose();
        socket.emit('random:disconnect'); // Disconnect chat after blocking
      } else {
        toast.error(response?.error || 'Something went wrong');
        onClose();
      }
    } catch (_) {
      // Fail silently for now
      return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="block-user-modal"
      aria-describedby="reason-error"
      sx={{ mt: 10, px: isSm ? 2 : 4 }}
    >
      <BlurWrapper>
        {/* Title */}
        <Typography variant="body1">
          Block <StyledText text={partner?.fullName} />
        </Typography>

        {/* Confirmation text */}
        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
          Are you sure you want to block <strong>{partner?.fullName}</strong>? You will no longer be
          able to send or receive messages from this user.
        </Typography>

        {/* Reason dropdown */}
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

        {/* Custom reason text field when 'Other' is selected */}
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

        {/* Action buttons */}
        <Stack direction="row" spacing={1} mt={3} flexWrap={isXs ? 'wrap' : 'nowrap'}>
          <Button variant="outlined" color="primary" fullWidth onClick={handleCancel}>
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
