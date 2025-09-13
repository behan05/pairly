const express = require('express');
const router = express.Router();
const passport = require('passport');
const generateToken = require('../../utils/generateToken');
const User = require('../../models/User.model');

// GitHub login redirect
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get(
    '/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const token = generateToken(req.user.id);
            const user = await User.findById(req.user.id);

            const userData = {
                success: true,
                message: 'Login successful!',
                authProvider: 'github',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                },
            };

            const userDataString = encodeURIComponent(JSON.stringify(userData));

            // Redirect back to frontend with user data
            res.redirect(`https://pairly.chat/verify?userData=${userDataString}`);
        } catch (_) {
            return;
        }
    }
);

module.exports = router;
