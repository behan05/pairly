const { Server } = require('socket.io');
const randomChatHandler = require('./randomChat');
const privateChatHandler = require('./privateChat');
const verifyToken = require('../utils/verifyToken');

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'https://connect-link-three.vercel.app'],
            credentials: true
        }
    });

    // Auth Middleware for Socket.IO
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error("Token missing"));

            // Custom utils function
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

    // Main connection handler
    io.on('connection', (socket) => {
        console.log(' User connected:', socket.id);

        // Custom event handlers
        randomChatHandler(io, socket);
        privateChatHandler(io, socket);

        socket.on('disconnect', () => {
            console.log(' User disconnected:', socket.id);
        });
    });
}

module.exports = { setupSocket };
