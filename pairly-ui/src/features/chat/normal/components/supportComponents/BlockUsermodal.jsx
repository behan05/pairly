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
    FormHelperText,
    Box
} from '@/MUI/MuiComponents';
import { BlockIcon } from '@/MUI/MuiIcons';

// components
import StyledText from '@/components/common/StyledText';

// redux
import { privateBlockUser } from '@/redux/slices/moderation/blockUserAction';
import { fetchAllUser } from '@/redux/slices/privateChat/privateChatAction';
import { useDispatch, useSelector } from 'react-redux';

// Toast notifications
import { toast } from 'react-toastify';

function BlockUserModal({ open, onClose, partner, partnerId, clearActiveChat, onCloseChatWindow }) {
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
        // If reason is 'other', ensure customReason has at least 5 chars
        if (formData.reason === 'other' && formData.customReason.trim().length < 5) {
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
            partnerUserId: partnerId
        };

        try {
            const response = await dispatch(privateBlockUser(payload));

            if (response?.success) {
                toast.success(response.message || 'User blocked successfully');
                // Close chat window and clear active chat
                if (typeof clearActiveChat === 'function') clearActiveChat(null);
                if (typeof onCloseChatWindow === 'function') onCloseChatWindow(null);
                // Refetch friend list to remove blocked user
                dispatch(fetchAllUser());
                onClose();
            } else {
                toast.error(response?.error || 'Something went wrong');
                onClose();
            }
        } catch (err) {
            console.error(err);
            return;
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleCancel}
            aria-labelledby="block-user-modal"
            aria-describedby="reason-error"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: isSm ? 1 : 2,
            }}
        >
            <Box
                sx={{
                    maxWidth: 520,
                    width: '100%',
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 1,
                    boxShadow: 24,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="h6" fontWeight={600}>
                        Block <StyledText text={partner?.fullName} />
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        You won’t be able to send or receive messages from this user.
                    </Typography>
                </Box>

                {/* Content */}
                <Box sx={{ px: 3, py: 2.5 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Please tell us why you are blocking{" "}
                        <strong>{partner?.fullName}</strong>.
                    </Typography>

                    {/* Reason dropdown */}
                    <FormControl
                        fullWidth
                        error={Boolean(error.reason)}
                        sx={{ mb: 1.5 }}
                        size='small'
                    >
                        <InputLabel id="blockReason-label">
                            Block reason
                        </InputLabel>
                        <Select
                            labelId="blockReason-label"
                            id="reason"
                            name="reason"
                            label="Block reason"
                            value={formData.reason}
                            onChange={handleChange}
                        >
                            <MenuItem value="inappropriate_messages">
                                Inappropriate messages
                            </MenuItem>
                            <MenuItem value="spam_or_advertising">
                                Spam or advertising
                            </MenuItem>
                            <MenuItem value="harassment_or_bullying">
                                Harassment or bullying
                            </MenuItem>
                            <MenuItem value="offensive_content">
                                Offensive content
                            </MenuItem>
                            <MenuItem value="fake_profile">
                                Fake profile
                            </MenuItem>
                            <MenuItem value="unwanted_contact">
                                Unwanted contact
                            </MenuItem>
                            <MenuItem value="scam_or_fraud">
                                Scam or fraud
                            </MenuItem>
                            <MenuItem value="privacy_concerns">
                                Privacy concerns
                            </MenuItem>
                            <MenuItem value="hate_speech_or_threats">
                                Hate speech or threats
                            </MenuItem>
                            <MenuItem value="other">
                                Other
                            </MenuItem>
                        </Select>
                        {error.reason && (
                            <FormHelperText>{error.reason}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Custom reason */}
                    {formData.reason === 'other' && (
                        <TextField
                            label="Additional details"
                            name="customReason"
                            value={formData.customReason}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            minRows={4}
                            maxRows={6}
                            placeholder="Briefly describe the issue"
                            error={Boolean(error.customReason)}
                            helperText={error.customReason}
                        />
                    )}
                </Box>

                {/* Footer actions */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    {/* Cancel */}
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleCancel}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.divider,
                            '&:hover': {
                                borderColor: theme.palette.text.secondary,
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    {/* Block */}
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={handleBlockConfirm}
                        endIcon={<BlockIcon fontSize="small" />}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: theme.palette.error.main,
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {isBlocking ? 'Blocking…' : 'Block user'}
                    </Button>
                </Box>

            </Box>
        </Modal>

    );
}

export default BlockUserModal;
