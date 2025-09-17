const express = require('express');
const Routers = express.Router();

const {
    blockUserControllerById,
    unblockUserControllerById,
    getBlockedUsersController,
} = require('../../../controllers/randomChatControllers/randomBlockController');

// middleware to identify user
const authMiddleware = require('../../../middlewares/authMiddleware');

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

