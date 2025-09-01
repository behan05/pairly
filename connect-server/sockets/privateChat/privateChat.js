const Conversation = require('../../models/chat/Conversation.model');
const Message = require('../../models/chat/Message.model');

const privateChatSessions = new Map();

function privateChatHandler(io, socket) {
    socket.on('privateChat:join', async ({ partnerUserId }) => {
        if (!partnerUserId) {
            socket.emit('privateChat:error', { error: 'missing partner Id' });
            return;
        }

        const me = socket.userId;
        const roomId = [me, partnerUserId].sort().join('-');
        socket.join(roomId);

        let conversation = await Conversation.findOne({
            participants: { $size: 2, $all: [partnerUserId, me] },
            isRandomChat: false
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [partnerUserId, me],
                isRandomChat: false,
                isActive: true,
                matchedAt: new Date()
            });
            await conversation.save();
        }

        privateChatSessions.set(me, {
            partnerId: partnerUserId,
            roomId,
            conversationId: conversation._id.toString()
        });

        socket.emit('privateChat:partner-joined', {
            partnerId: partnerUserId,
            conversationId: conversation._id.toString(),
            profile: null
        });
    });

    socket.on('privateChat:message', async ({ message, type }) => {
        const session = privateChatSessions.get(socket.userId);
        if (!session || !session.partnerId) {
            socket.emit('privateChat:error', { error: 'You are not connected to anyone yet.' });
            return;
        }

        const { partnerId, roomId } = session;
        const currentUserId = socket.userId;

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
                    text: newMessage.content,
                    senderId: newMessage.sender,
                    type: newMessage.messageType,
                    timestamp: newMessage.createdAt
                },
                senderId: newMessage.sender,
                type: newMessage.messageType,
                timestamp: newMessage.createdAt
            });
        } catch (err) {
            console.error('privateChat:message error', err);
            socket.emit('privateChat:error', { message: 'Failed to send message.' });
        }
    });

    socket.on('privateChat:partner-typing', () => { });
    socket.on('privateChat:partner-stopTyping', () => { });
    socket.on('privateChat:readMessage', () => { });
    socket.on('privateChat:partner-disconnected', () => { });
    socket.on('privateChat:userOnline', () => { });
    socket.on('privateChat:userOffline', () => { });
}

module.exports = privateChatHandler;
