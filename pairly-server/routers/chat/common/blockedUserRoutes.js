const express = require('express');
const Routers = express.Router();

const {
    getBlockedUsersController,
} = require('../../../controllers/common/fetchAllBlockedUsers');

// middleware to identify user
const authMiddleware = require('../../../middlewares/authMiddleware');

/**
 * @route   GET /api/block/users
 * @desc    Get list of users blocked by the current user
 */
Routers.get('/users', authMiddleware, getBlockedUsersController);

module.exports = Routers;
