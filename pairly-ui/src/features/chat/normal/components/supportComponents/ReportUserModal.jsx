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
    FormHelperText
} from '@/MUI/MuiComponents';
import { ReportIcon } from '@/MUI/MuiIcons';

// components
import BlurWrapper from '@/components/common/BlurWrapper';
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
            sx={{ mt: 10, px: isSm ? 2 : 4 }}
        >
            <BlurWrapper sx={{
                width: '100%',
                backgroundColor: theme.palette.background.paper
            }}>
                {/* Title */}
                <Typography variant="body1">
                    Report <StyledText text={partner?.fullName} />
                </Typography>

                {/* Confirmation text */}
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                    Are you sure you want to report <strong>{partner?.fullName}</strong>?.
                </Typography>

                {/* Reason dropdown */}
                <FormControl fullWidth margin="normal" error={Boolean(error.reason)}>
                    <InputLabel id="reportReason-label">Report Reason</InputLabel>
                    <Select
                        labelId="reportReason-label"
                        id="reason"
                        name="reason"
                        label="Report Reason"
                        value={formData.reason}
                        onChange={handleChange}
                    >
                        <MenuItem value="harassment">Harassment</MenuItem>
                        <MenuItem value="spam">Spam</MenuItem>
                        <MenuItem value="inappropriate-content">Inappropriate Content</MenuItem>
                        <MenuItem value="scam">scam</MenuItem>
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
                        onClick={handleReportConfirm}
                        endIcon={<ReportIcon fontSize="small" />}
                    >
                        {setIsReporting ? 'Reporting....' : 'Report'}
                    </Button>
                </Stack>
            </BlurWrapper>
        </Modal>
    );
}

export default ReportUserModal;
