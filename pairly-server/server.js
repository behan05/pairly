const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const { createServer } = require('node:http');
const { setupSocket } = require('./sockets/socketServer');

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

// ===================================
// Initialized razorpay payment gateway
// ===================================
require('./config/razorpay/razorpay');

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

const feedbackRoutes = require('./routers/feedback/feedbackRoutesRoutes')

const UserRoutes = require('./routers/searchUsers/UserRoutes')

const paymentRoutes = require('./routers/payment/paymentRoutes');

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
        'http://localhost:5174',
        'http://localhost:4173',
        'https://pairly.chat',
        'https://www.pairly.chat',
        'https://pairly-admin.vercel.app'
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

// Handle JSON & URL-encoded bodies with large payloads (e.g., media)
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Schedule daily cleanup of unverified users
require('./cron/cleanupUnverifiedUsers.cron');

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
app.use('/api/proposal-request', proposalRequestRoutes);

// ------------- Feedback Routes --------------------
app.use('/api/feedback', feedbackRoutes);
app.use('/api/feedback', feedbackRoutes);

// ------------- Get user using public Id --------------------
app.use('/api/users', UserRoutes);

// ------------- Payment Routes --------------------
app.use('/api/payments', paymentRoutes);

/**
 * ============================ ADMIN PANEL =====================================
*/
const adminRoutes = require('./routers/admin/adminRoutes');
app.use('/api/admin', adminRoutes);

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
