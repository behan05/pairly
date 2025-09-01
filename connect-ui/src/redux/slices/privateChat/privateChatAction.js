import axios from 'axios';
import {
    setAllUsers,
    setConversationMessages,
    setLoading,
    setError,
    reset
} from './privateChatSlice';
import { getAuthHeaders } from '@/utils/authHeaders';
import { PRIVATE_CHAT_API } from '@/api/config';

export function fetchAllUser() {
    return async (dispatch) => {
        dispatch(setLoading(true));

        const headers = getAuthHeaders();
        if (!headers) {
            dispatch(setError('Unauthorized: Token is missing'));
            dispatch(setLoading(false));
            return;
        }

        try {
            const response = await axios.get(`${PRIVATE_CHAT_API}/users`, { headers });

            if (response.data.success) {
                dispatch(setAllUsers(response.data.users));
            } else {
                dispatch(setError(response.data.error || 'Failed to fetch users'));
            }
        } catch (error) {
            dispatch(setError(error.response?.data?.error || 'Server error while fetching users'));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const fetchConversationMessages = (conversationId) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const headers = getAuthHeaders();
        const res = await axios.get(`${PRIVATE_CHAT_API}/user/${conversationId}`, { headers });
        if (res.data.success) {
            dispatch(setConversationMessages({ conversationId, messages: res.data.messages }));
        } else {
            dispatch(setError(res.data.error || 'Failed to fetch conversation'));
        }
    } catch (err) {
        dispatch(setError(err.message || 'Server error fetching messages'));
    } finally {
        dispatch(setLoading(false));
    }
};
