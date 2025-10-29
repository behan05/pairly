const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    headers: {
        "X-Razorpay-Account": process.env.MERCHANT_ACCOUNT_ID
    }
});

module.exports = razorpay;
