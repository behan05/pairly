import { useEffect } from 'react';
import { socket } from '@/services/socket';
import { useDispatch } from 'react-redux';
import {
    addChatUser,
    setActiveChat,
    addMessage,
    setLoading,
    setError,
    reset
} from '@/redux/slices/privateChat/privateChatSlice';

function NormalChatController() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket.connected) socket.connect();

        // Partner joined: server now sends conversationId and partner profile minimal

        socket.on('privateChat:partner-joined', ({ partnerId, conversationId, profile }) => {
            dispatch(addChatUser({
                partnerId,
                conversationId,
                name: profile?.name,
                avatar: profile?.avatar,
                isOnline: true
            }));
            dispatch(setActiveChat(conversationId));
        });

        socket.on('privateChat:error', ({ error }) => {
            dispatch(setError(error || 'Something went wrong in private chat.'));
        });

        socket.on('privateChat:message', ({ conversationId, message, senderId, type, timestamp }) => {
            const formatted = new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit'
            });

            dispatch(addMessage({
                conversationId,
                message: {
                    id: message?.id || `${conversationId}_${Date.now()}`,
                    text: message?.text ?? message,
                    senderId,
                    type,
                    timestamp: formatted
                }
            }));
        });

        // typing / stops / disconnected / read / presence - keep stubs
        socket.on('privateChat:partner-typing', () => { });
        socket.on('privateChat:partner-stopTyping', () => { });
        socket.on('privateChat:partner-disconnected', () => { });
        socket.on('privateChat:readMessage', () => { });
        socket.on('privateChat:userOnline', () => { });
        socket.on('privateChat:userOffline', () => { });

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
