const express = require('express');
const router = express.Router();
const passport = require('passport');
const generateToken = require('../../utils/generateToken');
const User = require('../../models/User.model');

// Start Google OAuth login
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        const token = generateToken(req.user.id);
        const user = await User.findById(req.user.id).populate('currentSubscriptionId');

        const subscriptionInfo = user.currentSubscriptionId
            ? {
                plan: user.currentSubscriptionId.plan,
                status: user.currentSubscriptionId.status,
                startDate: user.currentSubscriptionId.startDate,
                endDate: user.currentSubscriptionId.endDate,
                promoCode: user.currentSubscriptionId.promoCode || null,
                discountAmount: user.currentSubscriptionId.discountAmount || 0
            }
            : { plan: 'free', status: 'active' };

        const userData = {
            success: true,
            message: 'Login successful!',
            authProvider: 'google',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                subscription: subscriptionInfo
            }
        };

        const userDataString = encodeURIComponent(JSON.stringify(userData));

        res.redirect(`https://pairly.chat/verify?userData=${userDataString}`);
    }
);

module.exports = router;
