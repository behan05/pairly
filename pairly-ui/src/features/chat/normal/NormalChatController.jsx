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
import {
    setIncomingRequest,
    clearIncomingRequest,
    setOutgoingRequest,
    clearOutgoingRequest,
    setSleepSpaceError,
    setSleepSpaceLoading,
    resetState,
} from '@/redux/slices/sleepSpace/sleepSpaceRequest';

// toast prompt
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NormalChatController() {
    const dispatch = useDispatch();

    const { activePartnerId, allUsers } = useSelector(state => state.privateChat);
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

            // determine actual sender id from the message payload
            const senderId = message?.sender ?? message?.senderId;

            // new message ringtone: only play when the message is from another user
            const senderSettings = allUsers.find((u) => u.userId === senderId)?.settings || {};
            if (String(senderId) !== String(currentUserId) && senderSettings.newMessage) {
                try { new Audio('/messageTone/message-ringtone-magic.ogg').play(); } catch (e) { }
            }

            // auto-join if partner not active
            if (senderId && String(senderId) !== String(activePartnerId)) {
                socket.emit('privateChat:join', { partnerUserId: senderId });
            }

            dispatch(addMessage({
                conversationId,
                message: {
                    _id: message?._id ?? message?.clientMessageId,
                    content: message?.content ?? message?.text ?? '',
                    sender: senderId,
                    messageType: message?.messageType ?? message?.type ?? 'text',
                    createdAt,
                    seen: message?.seen ?? false
                }
            }));

            // Clear unread count if current user is the sender
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
            if (String(to) === String(currentUserId)) {
                dispatch(setPartnerTyping({ partnerId: from, isTyping: true }));
            }
        });

        socket.on('privateChat:partner-stopTyping', ({ from, to }) => {
            if (String(to) === String(currentUserId)) {
                dispatch(setPartnerTyping({ partnerId: from, isTyping: false }));
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

        // === Sleep Space Mode ===
        // socket.on('privateChat:sleepSpaceRequestReceived', (data) => {
        //     console.log("privateChat:sleepSpaceRequestReceived:", data);

        //     dispatch(setIncomingRequest({
        //         requestId: data?.to,
        //         from: data?.from,
        //         status: data?.status,
        //         message: data?.message,
        //     }));
        // });

        // socket.on('privateChat:sleepSpaceError', ({ error }) => {
        //     console.log("privateChat:sleepSpaceError:", error);

        //     dispatch(setSleepSpaceError(error));
        // });

        // socket.on('privateChat:sleepSpaceRequestAccepted', (data) => {
        //     dispatch(setOutgoingRequest({
        //         requestId: data._id,
        //         from: data.from,
        //         to: data.to,
        //         status: data.status,
        //     }));
        // });

        // socket.on('privateChat:sleepSpaceRequestReject', () => {
        //     dispatch(clearOutgoingRequest());
        // });

        // === Hear Together Mode ===
        // socket.on('privateChat:hearTogetherInvite', ({ from, to, message }) => {
        //     if (String(to) === String(currentUserId)) {
        //         toast.info(message || 'Your partner invited you to Hear Together 🎧');
        //     }
        // });

        // socket.on('privateChat:hearTogetherSent', ({ to, message }) => {
        //     if (String(to) === String(activePartnerId)) {
        //         toast.success(message || 'Hear Together request sent.');
        //     }
        // });

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
            // socket.off('privateChat:sleepSpaceRequestReceived');
            // socket.off('privateChat:sleepSpaceError');
            // socket.off('privateChat:sleepSpaceRequestAccepted');
            // socket.off('privateChat:sleepSpaceRequestReject');
            // socket.off('privateChat:hearTogetherInvite');
            // socket.off('privateChat:hearTogetherSent');
        };
    }, [dispatch, currentUserId, activePartnerId]);

    return null;
}

export default NormalChatController;
