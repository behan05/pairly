const {verifyToken} = require('../../utils/token.util')
async function socketAuthMiddleware(socket, next) {
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
}

module.exports = socketAuthMiddleware;