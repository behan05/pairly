const Routers = require('express').Router();
const {
    listPrivateChatUsersController,
    getPrivateChatMessagesControllerById,
    sendPrivateChatMessageControllerById,
    deletePrivateChatWithUserControllerById
} = require('../../controllers/privateChatControllers/privateChatController')

// middleware to identify user
const authMiddleware = require('../../middlewares/authMiddleware');


Routers.get('/list-all-users', authMiddleware, listPrivateChatUsersController);
Routers.get('/message/:userId', authMiddleware, getPrivateChatMessagesControllerById);
Routers.post('/message/:userId', authMiddleware, sendPrivateChatMessageControllerById);
Routers.delete('/message/:userId', authMiddleware, deletePrivateChatWithUserControllerById);

module.exports = Routers;