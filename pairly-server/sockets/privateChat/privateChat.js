const Conversation = require('../../models/chat/Conversation.model');
const Message = require('../../models/chat/Message.model');
const User = require('../../models/User.model');
const PrivateChatRequest = require('../../models/chat/PrivateChatRequest.model');

const privateChatSessions = new Map();

function privateChatHandler(io, socket, onlineUsers) {
    const currentUserId = socket.userId;

    // --- JOIN CHAT SESSION ---
    socket.on('privateChat:join', async ({ partnerUserId }) => {
        if (!partnerUserId) {
            socket.emit('privateChat:error', { error: 'partnerUserId is required.' });
            return;
        }

        const roomId = [currentUserId, partnerUserId].sort().join('-');
        socket.join(roomId);

        try {
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

            socket.emit('privateChat:partner-joined', {
                partnerId: partnerUserId,
                conversationId: conversation._id.toString(),
                profile: null
            });
        } catch (err) {
            console.error('privateChat:join error', err);
            socket.emit('privateChat:error', { error: 'Failed to join private chat.' });
        }
    });

    // --- SEND MESSAGE ---
    socket.on('privateChat:message', async ({ message, messageType }) => {
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
            const content = (typeof message === 'object') ? (message.text ?? message) : message;

            const newMessage = new Message({
                conversation: conversation._id,
                sender: currentUserId,
                content,
                messageType: messageType ?? 'text',
                delivered: true,
                seen: false,
                deleteAt: new Date(Date.now() + NINETY_DAYS)
            });

            await newMessage.save();

            io.to(roomId).emit('privateChat:message', {
                conversationId: conversation._id.toString(),
                message: {
                    _id: newMessage._id.toString(),
                    content: newMessage.content,
                    sender: typeof newMessage.sender === 'object' && newMessage.sender.toString ? newMessage.sender.toString() : String(newMessage.sender),
                    messageType: newMessage.messageType || 'text',
                    timestamp: newMessage.createdAt ? newMessage.createdAt.toISOString() : new Date().toISOString()
                },
            });
        } catch (err) {
            console.error('privateChat:message error', err);
            socket.emit('privateChat:error', { error: 'Failed to send message.' });
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

    // === Typing indicator: started ===
    socket.on('privateChat:typing', ({ from, to }) => {
        const session = privateChatSessions.get(currentUserId);
        if (!session || session.partnerId !== to) return;

        // find partner's socket
        const partnerSocket = [...io.sockets.sockets.values()]
            .find(s => String(s.userId) === String(to));

        if (partnerSocket) {
            io.to(partnerSocket.id).emit('privateChat:partner-typing', { from, to });
        }
    });

    // === Typing indicator: stopped ===
    socket.on('privateChat:stop-typing', ({ from, to }) => {
        const session = privateChatSessions.get(currentUserId);
        if (!session || session.partnerId !== to) return;

        // find partner's socket
        const partnerSocket = [...io.sockets.sockets.values()]
            .find(s => String(s.userId) === String(to));

        if (partnerSocket) {
            io.to(partnerSocket.id).emit('privateChat:partner-stopTyping', { from, to });
        }
    });

    // when server receives 'privateChat:getOnlineUsers'
    socket.on('privateChat:getOnlineUsers', async () => {
        try {
            // Find all accepted chat requests where user is involved
            const currentUserFriends = await PrivateChatRequest.find({
                $or: [
                    { to: currentUserId },
                    { from: currentUserId }
                ],
                status: 'accepted'
            }).lean();

            if (!currentUserFriends.length) {
                socket.emit('privateChat:allUsers', []);
                return;
            }

            // Extract friend IDs
            const allFriendsId = currentUserFriends.map(f =>
                f.from.toString() === currentUserId.toString() ? f.to : f.from
            );

            // Fetch all friend user objects at once
            const users = await User.find({ _id: { $in: allFriendsId } }).lean();

            const partnersWithStatus = users.map(u => ({
                userId: u._id.toString(),
                isOnline: onlineUsers.has(String(u._id)),
                lastSeen: u.lastSeen
            }));

            // Emit once with the full array
            socket.emit('privateChat:allUsers', partnersWithStatus);

        } catch (err) {
            console.error('privateChat:getOnlineUsers error', err);
            socket.emit('privateChat:error', { error: 'Failed to fetch online partners.' });
        }
    });

}

module.exports = privateChatHandler;
