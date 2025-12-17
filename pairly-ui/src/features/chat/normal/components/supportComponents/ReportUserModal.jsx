/**
 * @file ReportUserModal.jsx
 * @description
 * A modal component that allows the current user to report another user (partner) during a chat.
 * The modal provides a list of predefined reporting reasons or allows a custom reason when "Other" is selected.
 * Upon confirmation, the report request is dispatched via Redux to the moderation system.
 *
 * @component
 * @param {boolean} open - Whether the modal is visible.
 * @param {Function} onClose - Callback to close the modal.
 * @param {Object} partner - The partner user's information (e.g., fullName).
 * @param {string} partnerId - The partner's socket ID, used for identifying the reported session.
 *
 * @requires react
 * @requires @mui/material
 * @requires react-redux
 * @requires react-toastify
 *
 * @example
 * <ReportUserModal
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
import { ReportIcon } from '@/MUI/MuiIcons';

// components
import StyledText from '@/components/common/StyledText';

// redux
import { privateReportUser } from '@/redux/slices/moderation/reportUserAction';
import { useDispatch, useSelector } from 'react-redux';

// Toast notifications
import { toast } from 'react-toastify';

function ReportUserModal({ open, onClose, partner, partnerId }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    // Redux state for loading
    const { setIsReporting } = useSelector((state) => state.moderation);

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
     * Handle report confirmation and trigger API call
     */
    const handleReportConfirm = async () => {
        // If reason is 'other', ensure customReason has at least 5 chars
        if (formData.reason === 'other' && formData.customReason.trim().length < 5) {
            setError((prev) => ({
                ...prev,
                customReason:
                    'Please provide a meaningful explanation for selecting "Other" (min 5 characters).'
            }));
            return;
        }

        // If no reason selected, set error
        if (formData.reason.trim() === '') {
            setError((prev) => ({ ...prev, reason: 'Reporting reason is required.' }));
            return;
        }

        // Payload for API call
        const payload = {
            ...formData,
            partnerUserId: partnerId
        };

        try {
            const response = await dispatch(privateReportUser(payload));

            if (response?.success) {
                toast.success(response.message || 'User reported successfully');
                onClose();
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
            aria-labelledby="report-user-modal"
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
                        Report <StyledText text={partner?.fullName} />
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Your report helps us keep the community safe.
                    </Typography>
                </Box>

                {/* Content */}
                <Box sx={{ px: 3, py: 2.5 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Please select the reason for reporting{" "}
                        <strong>{partner?.fullName}</strong>.
                    </Typography>

                    {/* Reason dropdown */}
                    <FormControl
                        fullWidth
                        error={Boolean(error.reason)}
                        sx={{ mb: 1.5 }}
                        size='small'
                    >
                        <InputLabel id="reportReason-label">
                            Report reason
                        </InputLabel>
                        <Select
                            labelId="reportReason-label"
                            id="reason"
                            name="reason"
                            label="Report reason"
                            value={formData.reason}
                            onChange={handleChange}
                        >
                            <MenuItem value="harassment">Harassment</MenuItem>
                            <MenuItem value="spam">Spam</MenuItem>
                            <MenuItem value="inappropriate-content">
                                Inappropriate content
                            </MenuItem>
                            <MenuItem value="scam">Scam</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
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

                    {/* Report */}
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={handleReportConfirm}
                        endIcon={<ReportIcon fontSize="small" />}
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
                        {setIsReporting ? 'Reporting…' : 'Report user'}
                    </Button>
                </Box>

            </Box>
        </Modal>
    );
}

export default ReportUserModal;
