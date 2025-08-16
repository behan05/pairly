const Routers = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {
    getFriendRequestsController,
    acceptFriendRequestController,
    declineFriendRequestController
} = require('../../controllers/randomChatControllers/friendRequestController');

Routers.get('/users', authMiddleware, getFriendRequestsController);
Routers.post('/accept', authMiddleware, acceptFriendRequestController);
Routers.post('/reject', authMiddleware, declineFriendRequestController);

module.exports = Routers;