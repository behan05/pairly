const Conversation = require('../../models/chat/Conversation.model');
const Message = require('../../models/chat/Message.model');

const privateChatSessions = new Map(); 
const onlineUsers = new Map();

function privateChatHandler(io, socket) {
    const currentUserId = socket.userId;

    // --- JOIN CHAT SESSION ---
    socket.on('privateChat:join', async ({ partnerUserId }) => {
        if (!partnerUserId) {
            socket.emit('privateChat:error', { error: 'missing partner Id' });
            return;
        }

        const roomId = [currentUserId, partnerUserId].sort().join('-');
        socket.join(roomId);

        let conversation = await Conversation.findOne({
            participants: { $size: 2, $all: [partnerUserId, currentUserId] },
            isRandomChat: false
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [partnerUserId, currentUserId],
                isRandomChat: false,
                isActive: true,
                matchedAt: new Date()
            });
            await conversation.save();
        }

        privateChatSessions.set(currentUserId, {
            partnerId: partnerUserId,
            roomId,
            conversationId: conversation._id.toString()
        });

        // Mark user online
        onlineUsers.set(currentUserId, socket.id);

        // Notify current user about partner's presence
        if (onlineUsers.has(partnerUserId)) {
            socket.emit('privateChat:userOnline', { userId: partnerUserId });
        } else {
            socket.emit('privateChat:userOffline', { userId: partnerUserId });
        }

        // Notify partner that current user is online
        if (onlineUsers.has(partnerUserId)) {
            io.to(onlineUsers.get(partnerUserId)).emit('privateChat:userOnline', { userId: currentUserId });
        }

        socket.emit('privateChat:partner-joined', {
            partnerId: partnerUserId,
            conversationId: conversation._id.toString(),
            profile: null
        });
    });

    // --- SEND MESSAGE ---
    socket.on('privateChat:message', async ({ message, type }) => {
        const session = privateChatSessions.get(currentUserId);
        if (!session || !session.partnerId) {
            socket.emit('privateChat:error', { error: 'You are not connected to anyone yet.' });
            return;
        }

        const { partnerId, roomId } = session;

        try {
            let conversation = await Conversation.findOne({
                participants: { $size: 2, $all: [partnerId, currentUserId] },
                isRandomChat: false
            });

            if (!conversation) {
                conversation = new Conversation({
                    participants: [partnerId, currentUserId],
                    isRandomChat: false,
                    isActive: true,
                    matchedAt: new Date()
                });
                await conversation.save();
            }

            const NINETY_DAYS = 1000 * 60 * 60 * 24 * 90;
            const newMessage = new Message({
                conversation: conversation._id,
                sender: currentUserId,
                content: typeof message === 'object' ? message.text ?? message : message,
                messageType: type,
                delivered: true,
                seen: false,
                deleteAt: new Date(Date.now() + NINETY_DAYS)
            });

            await newMessage.save();

            io.to(roomId).emit('privateChat:message', {
                conversationId: conversation._id.toString(),
                message: {
                    id: newMessage._id.toString(),
                    content: newMessage.content,
                    senderId: newMessage.sender,
                    type: newMessage.messageType,
                    timestamp: newMessage.createdAt
                },
                senderId: newMessage.sender,
                type: newMessage.messageType,
                timestamp: newMessage.createdAt
            });
        } catch (err) {
            socket.emit('privateChat:error', { message: 'Failed to send message.' });
        }
    });

    // --- READ MESSAGES ---
    socket.on('privateChat:readMessage', async () => {
        const session = privateChatSessions.get(currentUserId);
        if (!session) {
            socket.emit('privateChat:error', { error: 'Session not found' });
            return;
        }

        const { conversationId, roomId, partnerId } = session;
        if (!conversationId || !roomId) {
            socket.emit('privateChat:error', { error: 'Error: you are not connected to anyone yet' });
            return;
        }

        try {
            await Message.updateMany(
                { conversation: conversationId, sender: partnerId, seen: false },
                { $set: { seen: true } }
            );

            const seenMessages = await Message.find({
                conversation: conversationId,
                sender: partnerId,
                seen: true
            }).select('_id');

            io.to(roomId).emit('privateChat:readMessage', {
                conversationId,
                messageIds: seenMessages.map(m => m._id.toString())
            });
        } catch (error) {
            socket.emit('privateChat:error', { message: 'Failed to mark messages as read.' });
        }
    });

    // --- DISCONNECT / OFFLINE ---
    socket.on('disconnect', () => {
        onlineUsers.delete(currentUserId);

        const session = privateChatSessions.get(currentUserId);
        if (session?.partnerId && onlineUsers.has(session.partnerId)) {
            io.to(onlineUsers.get(session.partnerId)).emit('privateChat:userOffline', { userId: currentUserId });
        }
    });

    // --- OPTIONAL STUBS (typing, etc.) ---
    socket.on('privateChat:partner-typing', () => { });
    socket.on('privateChat:partner-stopTyping', () => { });
    socket.on('privateChat:partner-disconnected', () => { });
}

module.exports = privateChatHandler;
