const Profile = require('../models/Profile.model');
const Settings = require('../models/settings.model');
const MatchQueue = require('../models/chat/MatchQueue.model');
const Block = require('../models/chat/Block.model');

// Message Storage.
const Conversation = require('../models/chat/Conversation.model')
const Message = require('../models/chat/Message.model')

// waiting queue and map for socket id or socket store
const waitingQueue = [];
const activeMatches = new Map();

// utils properties
const matchRandomUser = require('../utils/socket/matchRandomUser');
const disconnectMatchedUser = require('../utils/socket/disconnectMatchedUser');

function randomChatHandler(io, socket) {

    // === Join random chat ===
    socket.on('join-random', async () => {
        await matchRandomUser(socket, waitingQueue, activeMatches, Profile, io);
    });

    // === Handle messaging ===
    socket.on('random:message', async ({ message, type }) => {
        // Get partner's socket ID from activeMatches map
        const partnerId = activeMatches.get(socket.id);

        // If no partner, emit error back to sender and return
        if (!partnerId) {
            socket.emit('random:error', { message: 'No active match found. you are not connected to a partner.' });
            return;
        }

        try {
            // Get partner's userId using their socket
            const partnerSocket = io.sockets.sockets.get(partnerId);
            const partnerUserId = partnerSocket?.userId;

            // Find or create a Conversation document
            const conversation = await Conversation.findOne({
                participants: { $all: [partnerUserId, socket.userId] },
                isRandomChat: true
            });

            // Create and save a new Message document
            const newConversation = conversation || new Conversation({
                participants: [partnerUserId, socket.userId],
                isRandomChat: true,
                isActive: true,
                matchedAt: new Date()
            });

            if (!conversation) {
                await newConversation.save();
            }

            const newMessage = await new Message({
                conversation: newConversation._id,
                sender: socket?.userId,
                content: message,
                messageType: type,
                delivered: true,
                seen: false
            });

            await newMessage.save();

            // Emit the message to the partner
            partnerSocket.emit('random:message', {
                message,
                senderId: socket.userId,
                type,
                timestamp: newMessage.createdAt
            });

        } catch (error) {
            console.error('Error handling random message:', error);
            socket.emit('random:error', { message: 'Failed to send message.' });
        }
    });

    // === Emit message Seen ===
    socket.on("random:seen", async ({ messageId }) => {
        try {
            await Message.findByIdAndUpdate(messageId, { seen: true });
        } catch (err) {
            console.error("Error marking message as seen", err);
        }
    });

    // === Next chat ===
    socket.on('random:next', async () => {
        await disconnectMatchedUser(socket, io, activeMatches, waitingQueue, Conversation);
        await matchRandomUser(socket, waitingQueue, activeMatches, Profile, io);
    });

    // === Disconnect ===
    socket.on('random:disconnect', async () => {
        await disconnectMatchedUser(socket, io, activeMatches, waitingQueue, Conversation, Message);
    });

    // Typing started ===
    socket.on('random:typing', () => {
        const partnerId = activeMatches.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            partnerSocket?.emit('random:partner-typing', true);
        }
    });

    // Typing stopped ===
    socket.on('random:stop-typing', () => {
        const partnerId = activeMatches.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            partnerSocket?.emit('random:partner-typing', false);
        }
    });
}

module.exports = randomChatHandler;
