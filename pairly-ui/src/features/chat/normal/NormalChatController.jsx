import { useEffect } from 'react';
import { socket } from '@/services/socket';
import { useDispatch, useSelector } from 'react-redux';
import {
    addChatUser,
    setActiveChat,
    addMessage,
    setError,
    updateMessagesAsRead,
    setPartnerTyping
} from '@/redux/slices/privateChat/privateChatSlice';

function NormalChatController() {
    const dispatch = useDispatch();

    const { activePartnerId } = useSelector(state => state.privateChat);
    const currentUserId = useSelector((state) => state.profile.profileData?.userId ?? state.profile.profileData?.user);

    useEffect(() => {
        if (!socket.connected) socket.connect();

        // request current online/offline users
        socket.emit('privateChat:getOnlineUsers');

        socket.on('privateChat:partner-joined', ({ partnerId, conversationId }) => {
            dispatch(addChatUser({
                partnerId,
                conversationId,
            }));
            dispatch(setActiveChat(conversationId));
        });

        socket.on('privateChat:error', ({ error }) => {
            dispatch(setError(error || 'Something went wrong in private chat.'));
        });

        socket.on('privateChat:message', ({ conversationId, message }) => {
            const createdAt = message?.timestamp ?? message?.createdAt ?? new Date().toISOString();

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
        });

        socket.on('privateChat:readMessage', ({ conversationId, messageIds }) => {
            dispatch(updateMessagesAsRead({
                conversationId,
                messageIds
            }));
        });

        socket.on('privateChat:userOnline', ({ userId }) => {
            dispatch(addChatUser({ partnerId: userId, isOnline: true }));
        });

        socket.on('privateChat:userOffline', ({ userId, lastSeen }) => {
            dispatch(addChatUser({ partnerId: userId, isOnline: false, lastSeen }));
        });

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

        socket.on('privateChat:allUsers', (users) => {
            users.forEach(user => {
                dispatch(addChatUser({
                    partnerId: user.userId,
                    isOnline: user.isOnline,
                    lastSeen: user.lastSeen
                }));
            });
        });

        //  disconnected keep stubs
        socket.on('privateChat:partner-disconnected', () => { });

        return () => {
            socket.off('privateChat:partner-joined');
            socket.off('privateChat:error');
            socket.off('privateChat:message');
            socket.off('privateChat:partner-typing');
            socket.off('privateChat:partner-stopTyping');
            socket.off('privateChat:readMessage');
            socket.off('privateChat:userOnline');
            socket.off('privateChat:userOffline');
            socket.off('privateChat:partner-disconnected');
        };
    }, [dispatch, currentUserId, activePartnerId]);

    return null;
}

export default NormalChatController;
