const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'facebook', 'github'],
        default: 'local',
    },

    lastSeen: {
        type: Date,
        default: null,
    },

    // Email verification fields
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailToken: { type: String },

    // Subscription Plan
    subscriptionPlan: {
        type: String,
        enum: ['free', 'premium', 'superPremium'],
        default: 'free'
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'expired', 'pending'],
        default: 'active'
    },
    currentSubscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model('User', usersSchema);