const { Server } = require('socket.io');
const privateChatHandler = require('./privateChat/privateChat');
const verifyToken = require('../utils/socket/verifyToken');
const { randomChatHandler } = require('./randomChat/randomChat')

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
                'http://localhost:5173',
                'https://connect-link-git-main-behan-kumars-projects.vercel.app',
                'https://connect-link-qn0hm301c-behan-kumars-projects.vercel.app',
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

        // Register random chat events
        randomChatHandler(io, socket);

        // Register private chat events
        privateChatHandler(io, socket);

        // Handle disconnection
        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);
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
