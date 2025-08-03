const Routers = require('express').Router();
const { uploadRandomChatMediaController } = require('../../controllers/chat/randomChatController');
const authMiddleware = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/uploadRandomMedia');

Routers.post(
    '/media',
    authMiddleware,
    upload.single('media'),
    uploadRandomChatMediaController
);

module.exports = Routers;
