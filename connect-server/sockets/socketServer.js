const { Server } = require('socket.io');
const randomChatHandler = require('./randomChat');
const privateChatHandler = require('./privateChat');
const verifyToken = require('../utils/socket/verifyToken');

let ioInstance = null;

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'https://connect-link-three.vercel.app'],
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
        console.log('User connected:', socket.id);

        // Register random chat events
        randomChatHandler(io, socket);

        // Register private chat events
        privateChatHandler(io, socket);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

function getIO() {
    if (!ioInstance) {
        throw new Error('Socket.io not initialized. Call setupSocket() first.');
    }
    return ioInstance;
}

module.exports = { setupSocket, getIO };
