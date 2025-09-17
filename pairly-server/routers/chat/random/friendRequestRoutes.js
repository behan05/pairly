const Routers = require('express').Router();
const {
    getFriendRequestsController,
    acceptFriendRequestController,
    declineFriendRequestController
} = require('../../../controllers/randomChatControllers/friendRequestController');
const authMiddleware = require('../../../middlewares/authMiddleware');

Routers.get('/users', authMiddleware, getFriendRequestsController);
Routers.post('/accept', authMiddleware, acceptFriendRequestController);
Routers.post('/reject', authMiddleware, declineFriendRequestController);

module.exports = Routers;