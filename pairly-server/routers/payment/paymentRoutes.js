const router = require('express').Router();

const {
    createOrder,
    verifyPayment
} = require("../../controllers/paymentControllers/paymentController");

// middleware to identify user
const authMiddleware = require('../../middlewares/authMiddleware');

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);

module.exports = router;