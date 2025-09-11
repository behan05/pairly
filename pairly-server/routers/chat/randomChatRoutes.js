const Routers = require('express').Router();
const { uploadRandomChatMediaController } = require('../../controllers//randomChatControllers/randomChatController');
const authMiddleware = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/uploadRandomMedia');

/**
 * ================================
 *  Random Chat – Media Upload API
 * ================================
 */

/**
 * @route   POST /api/random-chat/media
 * @desc    Upload media (image/video) during random chat
 * @access  Private
 * @field   media - multipart/form-data (file field)
 */
Routers.post(
    '/media',
    authMiddleware,
    upload.single('media'),
    uploadRandomChatMediaController
);

module.exports = Routers;
