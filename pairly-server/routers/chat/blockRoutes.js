const express = require('express');
const Routers = express.Router();

const {
    blockUserControllerById,
    unblockUserControllerById,
    getBlockedUsersController,
} = require('../../controllers/randomChatControllers/blockController');

// middleware to identify user
const authMiddleware = require('../../middlewares/authMiddleware');

/**
 * @route   GET /api/block/users
 * @desc    Get list of users blocked by the current user
 */
Routers.get('/users', authMiddleware, getBlockedUsersController);

/**
 * @route   POST /api/block/user
 * @desc    Block a user by socket ID (in body)
 */
Routers.post('/user', authMiddleware, blockUserControllerById);

/**
 * @route   DELETE /api/block/user
 * @desc    Unblock a user by socket ID (in body)
 */
Routers.delete('/user', authMiddleware, unblockUserControllerById);

module.exports = Routers;

