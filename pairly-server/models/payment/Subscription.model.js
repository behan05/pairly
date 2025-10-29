const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    plan: {
        type: String,
        enum: ['free', 'premium', 'superPremium'],
        required: true,
        default: 'free'
    },

    status: {
        type: String,
        enum: ['active', 'inactive', 'expired', 'pending', 'failed'],
        default: function () {
            return this.plan === 'free' ? 'active' : 'pending';
        }
    },

    paymentProvider: {
        type: String,
        enum: ['razorpay'],
        required: function () {
            return this.plan !== 'free';
        }
    },

    amount: {
        type: Number,
        required: function () {
            return this.plan !== 'free';
        },
        default: 0
    },

    paymentId: {
        type: String,
        default: null
    },

    orderId: {
        type: String,
        default: null
    },

    currency: {
        type: String,
        default: 'INR'
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: {
        type: Date,
        default: null
    },

    renewal: {
        type: Boolean,
        default: false
    },

    invoiceUrl: {
        type: String,
        default: null
    },

    promoCode: {
        type: String,
        default: null
    },

    discountAmount: {
        type: Number,
        default: 0
    },

}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
