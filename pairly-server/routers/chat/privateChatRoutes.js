const Routers = require('express').Router();
const {
    listPrivateChatUsersController,
    getConversationMessagesController,
    sendPrivateChatMessageControllerById,
    deletePrivateChatWithUserControllerById
} = require('../../controllers/privateChatControllers/privateChatController')

// middleware to identify user
const authMiddleware = require('../../middlewares/authMiddleware');

Routers.get('/users', authMiddleware, listPrivateChatUsersController);
Routers.get('/user/:conversationId', authMiddleware, getConversationMessagesController);
Routers.post('/message/:userId', authMiddleware, sendPrivateChatMessageControllerById);
Routers.delete('/message/:userId', authMiddleware, deletePrivateChatWithUserControllerById);

module.exports = Routers;