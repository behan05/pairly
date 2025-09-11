import { useEffect } from 'react';
import { socket } from '@/services/socket';
import { useDispatch } from 'react-redux';
import {
    addChatUser,
    setActiveChat,
    addMessage,
    setError,
    updateMessagesAsRead
} from '@/redux/slices/privateChat/privateChatSlice';

function NormalChatController() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket.connected) socket.connect();

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

        // NORMALIZED MESSAGE LISTENER (minimal change - shape normalization)
        socket.on('privateChat:message', ({ conversationId, message, senderId, type, timestamp }) => {
            const createdAt = timestamp ?? (message?.timestamp ?? new Date().toISOString());

            dispatch(addMessage({
                conversationId,
                message: {
                    _id: message?.id,
                    content: message?.content ?? message?.text ?? '',
                    sender: senderId ?? message?.senderId ?? message?.sender,
                    messageType: type ?? message?.type ?? 'text',
                    createdAt,
                    seen: false
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

        socket.on('privateChat:userOffline', ({ userId }) => {
            dispatch(addChatUser({ partnerId: userId, isOnline: false }));
        });

        // typing / stops / disconnected / presence - keep stubs
        socket.on('privateChat:partner-typing', () => { });
        socket.on('privateChat:partner-stopTyping', () => { });
        socket.on('privateChat:partner-disconnected', () => { });

        return () => {
            socket.off('privateChat:partner-joined');
            socket.off('privateChat:error');
            socket.off('privateChat:message');
            socket.off('privateChat:partner-typing');
            socket.off('privateChat:partner-stopTyping');
            socket.off('privateChat:partner-disconnected');
            socket.off('privateChat:readMessage');
            socket.off('privateChat:userOnline');
            socket.off('privateChat:userOffline');
        };
    }, [dispatch]);

    return null;
}

export default NormalChatController;
