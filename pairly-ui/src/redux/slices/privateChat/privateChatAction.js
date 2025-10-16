import axios from 'axios';
import {
    setAllUsers,
    setConversationMessages,
    setLoading,
    setError,
    setProposalMusic,
    setUnreadCount,
} from './privateChatSlice';
import { getAuthHeaders } from '@/utils/authHeaders';
import { PRIVATE_CHAT_API } from '@/api/config';
import { PROPOSAL_REQUEST_API } from '@/api/config';

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
                const users = response.data.users || [];
                dispatch(setAllUsers(users));

                // Extract unread counts from API if provided
                users.forEach(user => {
                    if (user.conversationId && user.unreadCount) {
                        dispatch(setUnreadCount({
                            conversationId: user.conversationId,
                            partnerId: user.userId,
                            count: user.unreadCount
                        }));
                    }
                });

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

export const fetchUnreadCounts = () => async (dispatch) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const res = await axios.get(`${PRIVATE_CHAT_API}/unreadCounts`, { headers });
        if (res.data.success) {
            const counts = res.data.data; // should be { conversationId: { partnerId, count } }
            Object.entries(counts).forEach(([conversationId, { partnerId, count }]) => {
                dispatch(setUnreadCount({ conversationId, partnerId, count }));
            });
        }
    } catch (err) {
        console.error('Failed to fetch unread counts:', err);
    }
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

export const deleteConversationMessage = (conversationId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const headers = getAuthHeaders();

        try {
            const res = await axios.delete(
                `${PRIVATE_CHAT_API}/conversations/${conversationId}`,
                { headers }
            );

            if (res.data.success) {
                dispatch(setLoading(false));
                dispatch(setConversationMessages({ conversationId: null, messages: [] }));
                return {
                    success: true
                };
            } else {
                dispatch(setLoading(false));
                dispatch(setError(res.data.error || 'Failed to delete conversation'));
                return {
                    success: false
                };
            };
        } catch (error) {
            dispatch(setError(error.response?.data?.error || 'Server error deleting conversation'));
            return {
                success: false
            };
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const clearConversationMessage = (conversationId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const headers = getAuthHeaders();

        try {
            const res = await axios.delete(
                `${PRIVATE_CHAT_API}/conversations/${conversationId}/messages`,
                { headers }
            );

            if (res.data.success) {
                dispatch(setLoading(false));
                return {
                    success: true
                };
            } else {
                dispatch(setLoading(false));
                dispatch(setError(res.data.error || 'Failed to clear conversation message'));
                return {
                    success: false
                };
            };
        } catch (error) {
            dispatch(setError(error.response?.data?.error || 'Server error clearing conversation messages'));
            return {
                success: false
            };
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const getMusicBySelectType = (musicType) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        const headers = getAuthHeaders();
        if (!headers) {
            dispatch(setError('Unauthorized: Token is missing'));
            dispatch(setLoading(false));
            return;
        }

        try {
            const res = await axios.get(`${PROPOSAL_REQUEST_API}/audio/${musicType}`, { headers });

            if (res.data.success) {
                dispatch(setProposalMusic(res.data.data || []));
            } else {
                dispatch(setProposalMusic([]));
            }
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(setProposalMusic([]));
        } finally {
            dispatch(setLoading(false));
        }
    }
}


