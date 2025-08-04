const express = require('express');
const app = express();
const cors = require('cors');
const { createServer } = require('node:http');
const { setupSocket } = require('./sockets/socketServer');
require('dotenv').config();

// DB Connection
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routers/authRoutes');
const settingsRoutes = require('./routers/settingsRoutes');
const profileRoutes = require('./routers/profileRoutes');
const privateChatRoutes = require('./routers/chat/privateChatRoutes');
const randomChatRoutes = require('./routers/chat/randomChatRoutes');
const blockRoutes = require('./routers/chat/blockRoutes');

// PORT
const PORT = process.env.PORT || 8000;

// Connect to MongoDB database
connectDB();

// Create native HTTP server and attach Express app
const server = createServer(app);

// Setup WebSocket server for real-time communication
setupSocket(server); // pass raw server to websocket to bi-directional communication

// Enable CORS for specified origins
app.use(cors({
    origin: ['https://connect-link-three.vercel.app', 'http://localhost:5173'],
    credentials: true
}));

// Increase body size limit for large payloads (e.g., media uploads)
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Auto-delete expired messages and their media daily using a cron job
require('./cron/deleteRandomExpiredMessages.cron');

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/private-chat', privateChatRoutes);
app.use('/api/random-chat', randomChatRoutes);
app.use('/api/block', blockRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hey Server is running on render."
    });
})

// Start the server and listen on specified port
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
