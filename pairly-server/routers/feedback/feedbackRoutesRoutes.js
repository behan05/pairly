const routers = require('express').Router();

const { feedbackController } = require('../../controllers/feedback/feedbackController');
const authMiddleware = require('../../middlewares/authMiddleware');

routers.post('/', authMiddleware, feedbackController);

module.exports = routers;