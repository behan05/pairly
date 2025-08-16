import axios from 'axios';
import {
    setFriendRequests,
    setFriendRequestError,
    setFriendRequestLoading,
    clearErrorLoading,
    removeFriendRequest
} from '@/redux/slices/randomChat/friendRequestSlice';
import { getAuthHeaders } from '@/utils/authHeaders';
import { FRIEND_REQUEST_API } from '@/api/config';

/**
 * Fetches the list of incoming friend requests for the currently authenticated user.
 *
 * Dispatches a loading state before making the API call. On success, updates the friend
 * request list in the Redux store. On failure, can be extended to dispatch an error state.
 *
 * @function fetchFriendRequests
 * @returns {Function} Thunk function handled by Redux Thunk middleware.
 * The thunk returns a Promise resolving to:
 *   - { success: true } if the API call succeeds
 *   - { success: false } if the API call fails
 *
 * @description
 * This thunk:
 * 1. Dispatches `setFriendRequestLoading()` to indicate the request is in progress.
 * 2. Sends a GET request to `${FRIEND_REQUEST_API}/users` with authentication headers.
 * 3. On a successful response, dispatches `setFriendRequests()` with user details.
 * 4. Returns a success object to allow further UI handling.
 *
 * @throws {Error} Captures and can handle API request failures.
 */
export function fetchFriendRequests() {
    return async (dispatch) => {
        dispatch(setFriendRequestLoading());

        try {
            const response = await axios.get(`${FRIEND_REQUEST_API}/users`, {
                headers: getAuthHeaders()
            });

            if (response.data.success) {
                dispatch(clearErrorLoading());
                dispatch(setFriendRequests(response.data?.pendingRequests || []));
                return { success: true };
            } else {
                dispatch(setFriendRequestError(response.data?.error || 'Failed to fetch friend requests.'));
                return { success: false };
            }

        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.details ||
                "Network error";

            dispatch(setFriendRequestError(errorMessage));
            return { success: false, error: errorMessage };
        }
    };
}

/**
 * Accepts a friend request by sending the formData to the API.
 * Dispatches Redux actions for loading, success, and error states.
 *
 * @param {Object} formData - Data containing friend request details
 * @returns {Function} Thunk function
 */
export function acceptFriendRequest(formData) {
    return async (dispatch) => {
        dispatch(setFriendRequestLoading());

        try {
            const response = await axios.post(
                `${FRIEND_REQUEST_API}/accept`,
                formData,
                { headers: getAuthHeaders() }
            );

            if (response.data?.success) {
                dispatch(clearErrorLoading());
                dispatch(removeFriendRequest(formData?.sender));

                return {
                    success: true,
                    message: response.data?.message ?? 'Friend request accepted'
                };
            } else {
                const errorMsg = response.data?.error ?? "Something went wrong";
                dispatch(setFriendRequestError(errorMsg));

                return {
                    success: false,
                    error: errorMsg
                };
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.error || error.message || "Network error";

            dispatch(setFriendRequestError(errorMsg));

            return {
                success: false,
                error: errorMsg
            };
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
export function declineFriendRequest(formData) {
    return async (dispatch) => {
        dispatch(setFriendRequestLoading());

        try {
            const response = await axios.post(
                `${FRIEND_REQUEST_API}/reject`,
                formData,
                { headers: getAuthHeaders() }
            );

            if (response.data?.success) {
                dispatch(clearErrorLoading());
                dispatch(removeFriendRequest(formData?.sender));
                return {
                    success: true,
                    message: response.data?.message ?? 'Friend request rejected'
                };
            } else {
                const errorMsg = response.data?.error ?? "Something went wrong";
                dispatch(setFriendRequestError(errorMsg));

                return {
                    success: false,
                    error: errorMsg
                };
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.error || error.message || "Network error";

            dispatch(setFriendRequestError(errorMsg));

            return {
                success: false,
                error: errorMsg
            };
        }
    };
}
