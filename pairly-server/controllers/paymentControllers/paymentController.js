const razorpay = require("../../config/razorpay/razorpay");
const crypto = require("crypto");
const Subscription = require("../../models/payment/Subscription.model");
const User = require("../../models/User.model");

//  Create Razorpay order
exports.createOrder = async (req, res) => {
    try {
        const { userId, plan, amount, promoCode, discountAmount } = req.body;

        if (!userId || !plan || !amount) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        // Create order in Razorpay
        const order = await razorpay.orders.create(options);

        // Create local subscription record (pending)
        const subscription = await Subscription.create({
            userId,
            plan,
            amount,
            promoCode: promoCode,
            discountAmount: discountAmount,
            orderId: order.id,
            paymentProvider: "razorpay",
            status: "pending",
            startDate: new Date(),
        });

        // Update user
        await User.findByIdAndUpdate(userId, {
            currentSubscriptionId: subscription._id,
            subscriptionStatus: "pending",
        });

        res.json({ success: true, order });
    } catch (err) {
        console.error("Razorpay create order error:", err);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Verified successfully
            const subscription = await Subscription.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    paymentId: razorpay_payment_id,
                    status: "active",
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
                { new: true }
            );

            if (subscription) {
                await User.findByIdAndUpdate(userId, {
                    subscriptionPlan: subscription.plan,
                    subscriptionStatus: "active",
                    currentSubscriptionId: subscription._id,
                });
            };
            const subs = await Subscription.findOne({ orderId: razorpay_order_id }).lean();

            const payload = {
                plan: subs?.plan,
                status: subs?.status,
                startDate: subs?.startDate,
                endDate: subs?.endDate,
                promoCode: subs?.promoCode,
                discountAmount: subs?.discountAmount
            }

            return res.json({
                success: true,
                message: "Payment verified",
                subscription: payload,
            });

        } else {
            return res.status(400).json({
                success: false,
                error: "Invalid signature",
            });
        }
    } catch (err) {
        console.error("Razorpay verify error:", err);
        res.status(500).json({ success: false, error: "Verification failed" });
    }
};
