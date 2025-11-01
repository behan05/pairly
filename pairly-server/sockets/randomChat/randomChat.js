/**
 * @file Handles all Socket.IO events for random chat feature.
 * @module socket/randomChat
 */

// Profile Model
const Profile = require('../../models/Profile.model');
const Settings = require('../../models/settings.model');
const User = require('../../models/User.model');

// Message Storage
const Conversation = require('../../models/chat/Conversation.model')
const Message = require('../../models/chat/Message.model')
const Block = require('../../models/chat/Block.model');
const PrivateChatRequest = require('../../models/chat/PrivateChatRequest.model');

// utils properties
const matchRandomUser = require('../../utils/socket/matchRandomUser');
const disconnectMatchedUser = require('../../utils/socket/disconnectMatchedUser');

// separate modules
const requestHandler = require('./friendRequest/request');
const acceptHandler = require('./friendRequest/accept');
const rejectHandler = require('./friendRequest/reject');
const cancelHandler = require('./friendRequest/cancel');
const typingHandler = require('./typing/typingStatus');

// waiting queue and map for socket id or socket store
const waitingQueue = [];
const activeMatches = new Map();

/**
 * Handles all random chat related socket events for a connected user.
 *
 * @param {import('socket.io').Server} io - The main Socket.IO server instance
 * @param {import('socket.io').Socket} socket - The connected client socket
 */

function randomChatHandler(io, socket, userSocketMap) {

    // === Join random chat ===
    socket.on('join-random', async () => {
        socket.userId = String(socket.userId);
        await matchRandomUser(socket, waitingQueue, activeMatches, Profile, Block, User, Settings, userSocketMap);
    });

    // === Handle sending messages ===
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
            // Create a new message
            // Set a deleteAt date for the message to expire after 30 days
            const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
            const newMessage = await new Message({
                conversation: newConversation._id,
                sender: socket?.userId,
                content: message,
                messageType: type,
                delivered: true,
                seen: false,
                deleteAt: new Date(Date.now() + THIRTY_DAYS),
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

    // === Mark message as seen ===
    socket.on("random:seen", async ({ messageId }) => {
        try {
            await Message.findByIdAndUpdate(messageId, { seen: true });
        } catch (err) {
            console.error("Error marking message as seen", err);
        }
    });

    // === Move to next chat ===
    socket.on('random:next', async () => {
        await disconnectMatchedUser(socket, io, activeMatches, waitingQueue, Conversation, Message);
        await matchRandomUser(socket, waitingQueue, activeMatches, Profile, io);
    });

    // === Handle manual disconnect ===
    socket.on('random:disconnect', async () => {
        await disconnectMatchedUser(socket, io, activeMatches, waitingQueue, Conversation, Message);
    });

    // === Typing indicator: started ===
    typingHandler(io, socket, activeMatches)

    // === Friend Request Send ===
    requestHandler(io, socket, Conversation, PrivateChatRequest, activeMatches);

    // === Accepting the request ===
    acceptHandler(io, socket, PrivateChatRequest);

    // === Rejecting the request ===
    rejectHandler(io, socket, PrivateChatRequest);

    // === Cancel request ===
    cancelHandler(io, socket, PrivateChatRequest);
}

module.exports = {
    randomChatHandler,
    activeMatches,
    waitingQueue
};
