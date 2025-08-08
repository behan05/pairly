import { getAuthHeaders } from '@/utils/authHeaders';
import {
  setBlockedUsers,
  setBlockingDone,
  setIsBlocking,
  setModerationError,
  clearBlockedState
} from '../moderation/moderationSlice';
import { BLOCK_API } from '@/api/config';
import axios from 'axios';

/**
 * Fetches the list of users blocked by the currently authenticated user.
 *
 * Dispatches loading state, updates the blockedUsers list on success,
 * or sets an error message on failure.
 *
 * @returns {Function} Thunk function to be handled by Redux Thunk middleware.
 *          The thunk returns a Promise that resolves to an object:
 *          - { success: true } on successful API call
 *          - { success: false } on failure
 */
export function fetchBlockedUsers() {
  return async (dispatch) => {
    dispatch(setIsBlocking());

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        dispatch(setModerationError('Unauthorized: Token not found'));
        return { success: false };
      }

      const response = await axios.get(`${BLOCK_API}/users`, { headers });

      if (response.data?.success) {
        const responseData = response.data?.blockedUsers || [];
        dispatch(setBlockedUsers(responseData));
        return { success: true };
      } else {
        dispatch(setModerationError(response.data?.error || 'Failed to fetch blocked users'));
        return { success: false };
      }
    } catch (error) {
      dispatch(setModerationError(error.message || 'Something went wrong'));
      return { success: false };
    } finally {
      dispatch(setBlockingDone());
    }
  };
}

/**
 * Sends a request to block a user based on provided formData.
 *
 * @param {Object} formData - Data including the partner socketId or reason to block.
 * @returns {Function} Thunk function to be handled by Redux Thunk middleware.
 *          Resolves to:
 *            - { success: true, message: string } on success
 *            - { success: false } on failure
 */
export function blockUser(formData) {
  return async (dispatch) => {
    dispatch(setIsBlocking());

    try {
      const headers = getAuthHeaders();

      if (!headers) {
        dispatch(setBlockingDone());
        dispatch(setModerationError('Unauthorized: Token not found Please login.'));
        return { success: false };
      }

      const response = await axios.post(`${BLOCK_API}/user`, formData, {
        headers
      });
      if (response.data?.success) {
        dispatch(setBlockingDone());
        return { success: true, message: response.data?.message };
      } else {
        dispatch(setBlockingDone());
        dispatch(setModerationError(`${response.data?.error}`));
        return { success: false, error: response.data?.error };
      }
    } catch (error) {
      dispatch(setBlockingDone());
      dispatch(setModerationError(error.message || 'Something went wrong'));
      const backendError = error.response?.data?.error || error.message || 'Something went wrong';

      return { success: false, error: backendError };
    }
  };
}

/**
 * Sends a request to unblock a user using their socketId.
 *
 * @param {string} blockedPartnerSocketId - The socket ID of the user to unblock.
 * @returns {Function} Thunk function to be handled by Redux Thunk middleware.
 *          Resolves to:
 *            - { success: true, message: string } on success
 *            - { success: false } on failure
 */
export function unblockUser(blockedPartnerId) {
  return async (dispatch) => {
    dispatch(setIsBlocking());

    try {
      const headers = getAuthHeaders();
      if (!headers) {
        dispatch(setBlockingDone());
        dispatch(setModerationError('Unauthorized: Token not found'));
        return { success: false };
      }

      const response = await axios.delete(`${BLOCK_API}/user`, {
        headers,
        data: { blockedPartnerId }
      });

      if (response.data.success) {
        dispatch(setBlockingDone());
        dispatch(clearBlockedState(blockedPartnerId));
        return { success: true, message: response.data?.message };
      } else {
        dispatch(setBlockingDone());
        dispatch(setModerationError(`${response.data?.error}`));
        return { success: false };
      }
    } catch (error) {
      dispatch(setBlockingDone());
      dispatch(setModerationError(error.message || 'Something went wrong'));
      return { success: false };
    }
  };
}
