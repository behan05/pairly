const router = require('express').Router();

const { fetchUserByPublicUserId } = require('../../controllers/searchUserControllers/searchUserController')

// middleware to identify user
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/publicId/:publicId', authMiddleware, fetchUserByPublicUserId)

module.exports = router;