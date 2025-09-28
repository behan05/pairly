const { Server } = require('socket.io');
const privateChatHandler = require('./privateChat/privateChat');
const verifyToken = require('../utils/socket/verifyToken');
const { randomChatHandler } = require('./randomChat/randomChat')

// count total online user
let onlineUsersCount = new Set();
let onlineUsers = new Map();

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
    io.on('connection', (socket) => {

        // count number of active users and broadcast to all clients
        onlineUsersCount.add(socket.id);
        io.emit('onlineCount', onlineUsersCount.size);

        socket.on('getOnlineCount', () => {
            socket.emit('onlineCount', onlineUsersCount.size);
        });

        // flag user online
        onlineUsers.set(socket.userId.toString(), socket.id);

        // Notify to all user
        socket.broadcast.emit('privateChat:userOnline', { userId: socket.userId.toString() });
        socket.on('getOnlineUser', () => {
            socket.emit('privateChat:userOnline', { userId: socket.userId.toString() });
        });

        // Register random chat events
        randomChatHandler(io, socket);

        // Register private chat events
        privateChatHandler(io, socket);

        // Handle disconnection
        socket.on('disconnect', async () => {
            onlineUsersCount.delete(socket.id);
            io.emit('onlineCount', onlineUsersCount.size);

            // Flag user offline
            onlineUsers.delete(socket.userId.toString());

            // Notify to all user
            io.emit('privateChat:userOffline', { userId: socket.userId.toString() });
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
