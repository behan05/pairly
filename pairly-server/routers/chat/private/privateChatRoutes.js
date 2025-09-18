const Routers = require('express').Router();
const {
    listPrivateChatUsersController,
    getConversationMessagesController,
    clearPrivateChatMessageControllerById,
    deletePrivateChatWithUserControllerById
} = require('../../../controllers/privateChatControllers/privateChatController')

// middleware to identify user
const authMiddleware = require('../../../middlewares/authMiddleware');

Routers.get('/users', authMiddleware, listPrivateChatUsersController);
Routers.get('/user/:conversationId', authMiddleware, getConversationMessagesController);
Routers.delete('/conversations/:conversationId', authMiddleware, deletePrivateChatWithUserControllerById);
Routers.post('/message/:userId', authMiddleware, clearPrivateChatMessageControllerById);

module.exports = Routers;