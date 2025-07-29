const Routers = require('express').Router();
const {
    getRandomChatStatusController,
    startRandomChatController,
    nextRandomChatController,
    endRandomChatController
} = require('../../controllers/chat/randomChatController');

const authMiddleware = require('../../middlewares/authMiddleware');

Routers.get('/status', authMiddleware, getRandomChatStatusController);
Routers.post('/start', authMiddleware, startRandomChatController);
Routers.post('/next', authMiddleware, nextRandomChatController);
Routers.post('/end', authMiddleware, endRandomChatController);

module.exports = Routers;
