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

// Connect Database
connectDB();

// create native server
const server = createServer(app);
setupSocket(server); // pass raw server to websocket to bi-directional communication

// Middlewares
app.use(cors({
    origin: ['https://connect-link-three.vercel.app', 'http://localhost:5173'],
    credentials: true
}));

// Increased body size limit
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes); // For auth
app.use('/api/settings', settingsRoutes); // For settings
app.use('/api/profile', profileRoutes); //  for profile
app.use('/api/private-chat', privateChatRoutes) // for private chat
app.use('/api/random-chat', randomChatRoutes) // for random chat
app.use('/api/block', blockRoutes); // for block users

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hey Server is running on render."
    });
})

// App listne
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
