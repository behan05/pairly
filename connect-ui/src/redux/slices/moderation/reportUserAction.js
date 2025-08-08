import { getAuthHeaders } from '@/utils/authHeaders';
import { setModerationError, setReportingDone, setIsReporting } from '../moderation/moderationSlice';
import { REPORT_API } from '@/api/config';
import axios from 'axios';

/**
 * Sends a request to report a user during an active or past chat session.
 * 
 * @param {Object} formData - The report payload.
 * @param {string} formData.partnerSocketId - The socket ID of the partner being reported.
 * @param {string} formData.reason - The reason for reporting the user.
 * @returns {Function} Redux Thunk function.
 *          Resolves to:
 *            - { success: true, message: string } on success
 *            - { success: false, error?: string } on failure
 */
export function reportUser(formData) {
    return async (dispatch) => {
        dispatch(setIsReporting());

        try {
            const headers = getAuthHeaders();

            if (!headers) {
                dispatch(setReportingDone());
                dispatch(setModerationError("Unauthorized: Token not found. Please login."));
                return { success: false };
            }

            const response = await axios.post(`${REPORT_API}/user`, formData, { headers });

            if (response.data?.success) {
                dispatch(setReportingDone());
                return { success: true, message: response.data?.message };
            } else {
                dispatch(setReportingDone());
                dispatch(setModerationError(`${response.data?.error}`));
                return { success: false, error: response.data?.error };
            }

        } catch (error) {
            dispatch(setReportingDone());
            const backendError =
                error.response?.data?.error ||
                error.message ||
                "Something went wrong";
            dispatch(setModerationError(backendError));
            return { success: false, error: backendError };
        }
    };
}
