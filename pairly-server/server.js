const express = require('express');
const app = express();
const cors = require('cors');
const { createServer } = require('node:http');
const { setupSocket } = require('./sockets/socketServer');
require('dotenv').config();

// Social OAuth Provider
const passport = require('passport');
require('./config/passport/passportGoogle');
require('./config/passport/passportGithub');
const googleRoutes = require('./routers/auth/googleAuth');
const githubRoutes = require('./routers/auth/githubAuth');

// ==========================
// Initialized social auth
// ==========================
app.use(passport.initialize());

// ==========================
// Database Connection
// ==========================
const connectDB = require('./config/db');

// ==========================
// Route Imports
// ==========================
const authRoutes = require('./routers/auth/authRoutes');
const settingsRoutes = require('./routers/settingsRoutes');
const profileRoutes = require('./routers/profileRoutes');
const privateChatRoutes = require('./routers/chat/privateChatRoutes');
const randomChatRoutes = require('./routers/chat/randomChatRoutes');
const blockRoutes = require('./routers/chat/blockRoutes');
const reportRoutes = require('./routers/chat/reportRoutes');
const friendRequestRoutes = require('./routers/chat/friendRequestRoutes');

// ==========================
// App Configuration
// ==========================
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Create HTTP server and attach Express app
const server = createServer(app);

// Setup WebSocket server for real-time communication
setupSocket(server); // Attach WebSocket to raw HTTP server

// Enable CORS for allowed origins
app.use(cors({
    origin: [
        'https://connect-link-three.vercel.app',
        'http://localhost:5173',
        'http://localhost:4173',
        'https://pairly.chat',
        'https://www.pairly.chat',
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

// Handle JSON & URL-encoded bodies with large payloads (e.g., media)
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Schedule daily cleanup of expired messages and media
require('./cron/deleteRandomExpiredMessages.cron');

// ==========================
// Register API Routes
// ==========================
app.use('/api/auth', googleRoutes);
app.use('/api/auth', githubRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/private-chat', privateChatRoutes);
app.use('/api/random-chat', randomChatRoutes);
app.use('/api/random-block', blockRoutes);
app.use('/api/random-report', reportRoutes);
app.use('/api/friend-request', friendRequestRoutes)

// ==========================
// Health Check Route
// ==========================
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hey! Server is running on Render."
    });
});

// ==========================
// Start Server
// ==========================
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
