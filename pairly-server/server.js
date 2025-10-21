const express = require('express');
const app = express();
const cors = require('cors');
const { createServer } = require('node:http');
const { setupSocket } = require('./sockets/socketServer');
const path = require('path');
const dotenv = require('dotenv');

// Load correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Loaded: ${envFile}`);

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
const blockedUser = require('./routers/chat/common/blockedUserRoutes');

const randomChatRoutes = require('./routers/chat/random/randomChatRoutes');
const friendRequestRoutes = require('./routers/chat/random/friendRequestRoutes');
const randomBlockRoutes = require('./routers/chat/random/randomBlockRoutes');
const randomReportRoutes = require('./routers/chat/random/randomReportRoutes');

const privateChatRoutes = require('./routers/chat/private/privateChatRoutes');
const privateBlockRoutes = require('./routers/chat/private/privateBlockRoutes')
const privateReportRoutes = require('./routers/chat/private/privateReportRoutes')
const proposalRequestRoutes = require('./routers/chat/private/proposalRequestRoutes')

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

// ------------ All Blocked Users ---------------------
app.use('/api/blocked', blockedUser)

// ------------- Random Chat Routes --------------------
app.use('/api/random-chat', randomChatRoutes);
app.use('/api/random-block', randomBlockRoutes);
app.use('/api/random-report', randomReportRoutes);
app.use('/api/friend-request', friendRequestRoutes);

// ------------- Private Chat Routes --------------------
app.use('/api/private-chat', privateChatRoutes);
app.use('/api/private-block', privateBlockRoutes);
app.use('/api/private-report', privateReportRoutes);
app.use('/api/private-report', privateReportRoutes);
app.use('/api/proposal-request', proposalRequestRoutes);

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
