const { Server } = require('socket.io');
const randomChatHandler = require('./randomChat');
const privateChatHandler = require('./privateChat');
const verifyToken = require('../utils/verifyToken');

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ['https://connect-link-three.vercel.app', 'http://localhost:5173/connect'],
            credentials: true
        }
    });

    // Auth Middleware for Socket.IO
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        const user = await verifyToken(token);
        if (!user) return next(new Error('Authentication error'));

        socket.userId = user._id;
        socket.user = user;
        next();
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
