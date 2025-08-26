import axios from 'axios';
import {
    setUsers,
    setActiveChat,
    addMessage,
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
                dispatch(setUsers(response.data.users));
            } else {
                dispatch(setError(response.data.error || 'Failed to fetch users'));
            }
        } catch (error) {
            dispatch(setError(error.response?.data?.error || 'Server error while fetching users'));
        } finally {
            dispatch(setLoading(false));
        }
    };
}
