const router = require('express').Router();

const {
    createOrderController,
    verifyPaymentController,
    getPaymentInvoiceController
} = require("../../controllers/paymentControllers/paymentController");

// middleware to identify user
const authMiddleware = require('../../middlewares/authMiddleware');

router.post("/create-order", authMiddleware, createOrderController);
router.post("/verify-payment", authMiddleware, verifyPaymentController);
router.get("/invoices", authMiddleware, getPaymentInvoiceController);

module.exports = router;