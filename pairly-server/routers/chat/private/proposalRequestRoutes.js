const Routers = require('express').Router();
const {
    getAudioController,
    createProposalController
} = require('../../../controllers/privateChatControllers/proposalController');

// middleware to identify user
const authMiddleware = require('../../../middlewares/authMiddleware');

Routers.post('/proposal', authMiddleware, createProposalController);
Routers.get('/audio/:musicType', authMiddleware, getAudioController);

module.exports = Routers;