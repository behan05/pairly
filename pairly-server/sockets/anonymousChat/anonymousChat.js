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

// separate modules
const matchHandler = require('./matchUser/matchAnonymousUser');
const messageHandler = require('./message/messageExchange');
const matchNextHandler = require('./next/matchNext');
const disconnectMatchedUser = require('./disconnect/disconnectMatchedUser');
const typingHandler = require('./typing/typingStatus');

// waiting queue and map for socket id or socket store
const waitingQueue = [];
const activeMatches = new Map();

/**
 * Handles all anonymous chat related socket events for a connected user.
 *
 * @param {import('socket.io').Server} io - The main Socket.IO server instance
 * @param {import('socket.io').Socket} socket - The connected client socket
 */

function anonymousChatHandler(io, socket, userSocketMap) {

    socket.on('join:anonymous', async () => {
        await matchHandler(
            socket,
            waitingQueue,
            activeMatches,
            Profile,
            User,
            Settings,
            Conversation,
            userSocketMap
        );
    });

    socket.on('anonymous:message', async () => {
        // await messageHandler();
    });

    socket.on('anonymous:next', async () => {
        // await matchNextHandler()
    });

    socket.on('anonymous:typing', async () => {
        // await typingHandler()
    })

    socket.on('anonymous:disconnect', async () => {
        // await disconnectMatchedUser();
    })
}

module.exports = anonymousChatHandler;