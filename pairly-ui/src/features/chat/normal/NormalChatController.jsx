import { useEffect } from 'react';
import { socket } from '@/services/socket';
import { useDispatch, useSelector } from 'react-redux';
import {
    addChatUser,
    setActiveChat,
    addMessage,
    setError,
    updateMessagesAsRead,
    setPartnerTyping,
    setUnreadCount
} from '@/redux/slices/privateChat/privateChatSlice';

function NormalChatController() {
    const dispatch = useDispatch();

    const { activePartnerId } = useSelector(state => state.privateChat);
    const currentUserId = useSelector(
        (state) => state.profile.profileData?.userId ?? state.profile.profileData?.user
    );

    useEffect(() => {
        if (!socket.connected) socket.connect();

        // request current online/offline users
        socket.emit('privateChat:getOnlineUsers');

        // --- partner joined ---
        socket.on('privateChat:partner-joined', ({ partnerId, conversationId }) => {
            if (!partnerId || !conversationId) return;
            dispatch(addChatUser({ partnerId, conversationId }));
            dispatch(setActiveChat(conversationId));
        });

        // --- error handler ---
        socket.on('privateChat:error', ({ error }) => {
            dispatch(setError(error || 'Something went wrong in private chat.'));
        });

        // --- new message ---
        socket.on('privateChat:message', ({ conversationId, message, partnerId }) => {
            if (!message) return;
            const createdAt = message?.timestamp ?? message?.createdAt ?? new Date().toISOString();

            // auto-join if partner not active
            if (partnerId && String(partnerId) !== String(activePartnerId)) {
                socket.emit('privateChat:join', { partnerUserId: partnerId });
            }

            dispatch(addMessage({
                conversationId,
                message: {
                    _id: message?._id ?? message?.clientMessageId,
                    content: message?.content ?? message?.text ?? '',
                    sender: message?.sender ?? message?.senderId,
                    messageType: message?.messageType ?? message?.type ?? 'text',
                    createdAt,
                    seen: message?.seen ?? false
                }
            }));

            // Clear unread count if current user is the sender
            const senderId = message?.sender ?? message?.senderId;
            if (String(senderId) === String(currentUserId)) {
                dispatch(setUnreadCount({
                    conversationId,
                    partnerId,
                    count: 0
                }));
            }
        });

        socket.on('privateChat:unreadCountUpdate', ({ conversationId, partnerId, count }) => {
            dispatch(setUnreadCount({ conversationId, partnerId, count }));
        });

        // --- mark messages as read ---
        socket.on('privateChat:readMessage', ({ conversationId, messageIds }) => {
            if (conversationId && Array.isArray(messageIds)) {
                dispatch(updateMessagesAsRead({ conversationId, messageIds }));
            }
        });

        // --- user status updates ---
        socket.on('privateChat:userOnline', ({ userId }) => {
            if (userId) dispatch(addChatUser({ partnerId: userId, isOnline: true }));
        });

        socket.on('privateChat:userOffline', ({ userId, lastSeen }) => {
            if (userId) dispatch(addChatUser({ partnerId: userId, isOnline: false, lastSeen }));
        });

        // --- typing indicators ---
        socket.on('privateChat:partner-typing', ({ from, to }) => {
            if (
                String(to) === String(currentUserId) &&
                String(from) !== String(currentUserId) &&
                String(from) === String(activePartnerId)
            ) {
                dispatch(setPartnerTyping(true));
            }
        });

        socket.on('privateChat:partner-stopTyping', ({ from, to }) => {
            if (
                String(to) === String(currentUserId) &&
                String(from) === String(activePartnerId)
            ) {
                dispatch(setPartnerTyping(false));
            }
        });

        // --- all friends online/offline ---
        socket.on('privateChat:allUsers', (users) => {
            if (!Array.isArray(users)) return;
            users.forEach(user => {
                dispatch(addChatUser({
                    partnerId: user.userId,
                    isOnline: user.isOnline,
                    lastSeen: user.lastSeen
                }));
            });
        });

        // cleanup
        return () => {
            socket.off('privateChat:partner-joined');
            socket.off('privateChat:error');
            socket.off('privateChat:message');
            socket.off('privateChat:unreadCountUpdate');
            socket.off('privateChat:partner-typing');
            socket.off('privateChat:partner-stopTyping');
            socket.off('privateChat:readMessage');
            socket.off('privateChat:userOnline');
            socket.off('privateChat:userOffline');
            socket.off('privateChat:allUsers');
        };
    }, [dispatch, currentUserId, activePartnerId]);

    return null;
}

export default NormalChatController;
