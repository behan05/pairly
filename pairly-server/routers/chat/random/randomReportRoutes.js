const express = require('express');
const Routers = express.Router();

const {
    reportUserChatController,
} = require('../../../controllers/randomChatControllers/randomReportController.js');

// middleware to identify user
const authMiddleware = require('../../../middlewares/authMiddleware');

/**
 * @route   POST /api/random-report/user
 * @desc    Report by partner during the chat
 */
Routers.post('/user', authMiddleware, reportUserChatController);

module.exports = Routers;