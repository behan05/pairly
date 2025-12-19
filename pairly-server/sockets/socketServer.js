const { Server } = require('socket.io');
const privateChatHandler = require('./privateChat/privateChat');
const verifyToken = require('../utils/socket/verifyToken');
const { randomChatHandler } = require('./randomChat/randomChat');
const User = require('../models/User.model');

// count total online user
let onlineUsersCount = new Set();
let onlineUsers = new Map();

// Track all sockets per user: userId -> Set(socketId)
const userSocketMap = new Map();
/**
 * Initializes and configures the Socket.IO server.
*
* @param {http.Server} server - The HTTP server instance to attach Socket.IO to.
* @returns {void}
*
* - Applies CORS settings for allowed origins.
* - Adds authentication middleware to verify token and attach user info.
* - Sets up random and private chat handlers.
* - Handles cleanup on client disconnect (including DB and Cloudinary cleanup).
*/

let ioInstance = null;
function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: [
                'https://connect-link-three.vercel.app',
                'https://pairly.chat',
                'https://www.pairly.chat',
            ],
            credentials: true
        }
    });

    ioInstance = io;

    // === Socket.IO authentication middleware ===
    io.use(async (socket, next) => {
        try {
            // Extract token from client auth
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error("Token missing"));

            // Verify token and attach user info to socket
            const user = await verifyToken(token);
            if (!user) return next(new Error("Authentication failed"));

            socket.userId = user._id;
            socket.user = user;
            next();
        } catch (err) {
            console.error("Socket auth error:", err.message);
            next(new Error("Authentication error"));
        }
    });

    // === Main connection listener ===
    io.on('connection', async (socket) => {
        // track socket id for this user
        const uid = String(socket.userId);
        if (!userSocketMap.has(uid)) userSocketMap.set(uid, new Set());
        userSocketMap.get(uid).add(socket.id);

        // Update DB (mark online)
        await User.findByIdAndUpdate(
            socket.userId,
            { isOnline: true },
            { new: true }
        );

        // count active socket connections
        onlineUsersCount.add(socket.id);
        io.emit('onlineCount', onlineUsersCount.size);

        socket.on('getOnlineCount', () => {
            socket.emit('onlineCount', onlineUsersCount.size);
        });

        // mark user as online in onlineUsers map (track set of socket ids)
        if (!onlineUsers.has(uid)) onlineUsers.set(uid, new Set());
        onlineUsers.get(uid).add(socket.id);

        // send all online users one by one to the new client
        for (const userId of onlineUsers.keys()) {
            // only announce users that have at least one active socket
            const sockets = onlineUsers.get(userId);
            if (sockets && sockets.size > 0) socket.emit('privateChat:userOnline', { userId });
        }

        // notify others about this user
        socket.broadcast.emit('privateChat:userOnline', { userId: socket.userId });

        // Register random chat events
        randomChatHandler(io, socket, userSocketMap);

        // Register private chat events
        privateChatHandler(io, socket, onlineUsers);

        // Handle disconnection
        socket.on('disconnect', async () => {
            // remove this socket from active counts
            onlineUsersCount.delete(socket.id);
            io.emit('onlineCount', onlineUsersCount.size);

            const uid = String(socket.userId);

            // remove socket id from user's socket set
            const socketsSet = userSocketMap.get(uid);
            if (socketsSet) {
                socketsSet.delete(socket.id);
                if (socketsSet.size === 0) {
                    userSocketMap.delete(uid);
                } else {
                    userSocketMap.set(uid, socketsSet);
                }
            }

            // also remove from onlineUsers map
            const onlineSet = onlineUsers.get(uid);
            if (onlineSet) {
                onlineSet.delete(socket.id);
                if (onlineSet.size === 0) {
                    onlineUsers.delete(uid);

                    // Update DB only when user's last socket disconnected
                    const updateLastActivity = await User.findByIdAndUpdate(
                        socket.userId,
                        {
                            isOnline: false,
                            lastSeen: new Date()
                        },
                        { new: true }
                    );

                    // notify others that this user is offline
                    io.emit('privateChat:userOffline', { userId: socket.userId, lastSeen: updateLastActivity?.lastSeen });
                } else {
                    // still has active sockets — do not mark offline
                    onlineUsers.set(uid, onlineSet);
                }
            } else {
                // no onlineSet found — ensure userSocketMap cleaned and mark offline as fallback
                const updateLastActivity = await User.findByIdAndUpdate(
                    socket.userId,
                    {
                        isOnline: false,
                        lastSeen: new Date()
                    },
                    { new: true }
                );
                io.emit('privateChat:userOffline', { userId: socket.userId, lastSeen: updateLastActivity?.lastSeen });
            }
        });
    });
}

/**
 * Returns the initialized Socket.IO server instance.
 *
 * @returns {Server} The Socket.IO server instance.
 * @throws {Error} If Socket.IO has not been initialized via setupSocket().
 */

function getIO() {
    if (!ioInstance) {
        throw new Error('Socket.io not initialized. Call setupSocket() first.');
    }
    return ioInstance;
}

module.exports = { setupSocket, getIO };
