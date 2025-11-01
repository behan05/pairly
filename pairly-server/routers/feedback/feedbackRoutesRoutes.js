const routers = require('express').Router();

const { feedbackController } = require('../../controllers/feedbackControllers/feedbackController');
const authMiddleware = require('../../middlewares/authMiddleware');

routers.post('/', authMiddleware, feedbackController);

module.exports = routers;