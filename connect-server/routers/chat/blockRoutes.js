const Routers = require('express').Router();
const {
    blockUserControllerById,
    unblockUserControllerById,
    getBlockedUsersController,
    isUserBlockedControllerById
} = require('../../controllers/chat/blockController');

// middleware to identify user
const authMiddleware = require('../../middlewares/authMiddleware');

// Get all blocked users
Routers.get('/list-all-users', authMiddleware, getBlockedUsersController);

// Block a user
Routers.post('/:userId', authMiddleware, blockUserControllerById);

// Unblock a user
Routers.delete('/:userId', authMiddleware, unblockUserControllerById);

// Check if a user is blocked (optional)
Routers.get('/isBlocked/:userId', authMiddleware, isUserBlockedControllerById);

module.exports =  Routers;
