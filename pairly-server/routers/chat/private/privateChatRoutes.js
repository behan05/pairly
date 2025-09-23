const Routers = require('express').Router();
const {
    listPrivateChatUsersController,
    getConversationMessagesController,
    clearPrivateChatMessageControllerById,
    deletePrivateChatWithUserControllerById,
    uploadPrivateChatMediaController
} = require('../../../controllers/privateChatControllers/privateChatController');

// middleware to extract media from port request
const upload = require('../../../middlewares/uploadPrivateMedia');

// middleware to identify user
const authMiddleware = require('../../../middlewares/authMiddleware');

Routers.get('/users', authMiddleware, listPrivateChatUsersController);
Routers.get('/user/:conversationId', authMiddleware, getConversationMessagesController);
Routers.delete('/conversations/:conversationId', authMiddleware, deletePrivateChatWithUserControllerById);
Routers.delete('/conversations/:conversationId/messages', authMiddleware, clearPrivateChatMessageControllerById);

/**
 * ================================
 *  Private Chat – Media Upload API
 * ================================
 */
Routers.post(
    '/media',
    authMiddleware,
    upload.single('media'),
    uploadPrivateChatMediaController
);

module.exports = Routers;