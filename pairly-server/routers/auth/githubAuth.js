const express = require('express');
const router = express.Router();
const passport = require('passport');
const generateToken = require('../../utils/generateToken');
const User = require('../../models/User.model');
const { nanoid } = require('nanoid');

// ==============================
// Activity & Security Tracking
// ==============================
const LoginActivity = require('../../models/LoginActivity.model');
const axios = require('axios');

// GitHub login redirect
router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback
router.get(
    '/github/callback',
    (req, res, next) => {
        passport.authenticate('github', { session: false }, async (err, user) => {
            if (err || !user) {
                // Log failed GitHub login
                try {
                    const ip =
                        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                        req.headers['x-real-ip'] ||
                        req.socket?.remoteAddress ||
                        null;

                    await LoginActivity.create({
                        user: null,
                        ip,
                        agent: req.headers['user-agent'] || null,
                        success: false,
                        reason: 'GitHub OAuth failed'
                    });
                } catch (e) {
                    console.error('Failed login activity log error:', e.message);
                }

                return res.redirect('/login');
            }

            req.user = user;
            next();
        })(req, res, next);
    },
    async (req, res) => {
        try {
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

            // ===== Helpers (same as Google) =====
            const getClientIp = (req) =>
                req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                req.headers['x-real-ip'] ||
                req.socket?.remoteAddress ||
                null;

            const fetchGeo = async (ip) => {
                try {
                    const isLocal =
                        !ip ||
                        ip === '::1' ||
                        ip === '127.0.0.1' ||
                        ip.startsWith('192.168.') ||
                        ip.startsWith('10.');

                    const url = isLocal
                        ? 'https://ipapi.co/json/'
                        : `https://ipapi.co/${ip}/json/`;

                    const res = await axios.get(url, {
                        timeout: 4000,
                        headers: { 'User-Agent': 'Pairly-Server/1.0' }
                    });

                    return res?.data || null;
                } catch {
                    return null;
                }
            };

            const logLoginActivity = async ({ user, req, success, reason }) => {
                const ip = getClientIp(req);
                const agent = req.headers['user-agent'] || null;
                const geo = await fetchGeo(ip);

                await LoginActivity.create({
                    user,
                    ip,
                    agent,
                    geo: geo
                        ? {
                            city: geo.city,
                            state: geo.region,
                            stateCode: geo.region_code,
                            country: geo.country_name,
                            countryCode: geo.country,
                            continent: geo.continent_name,
                            continentCode: geo.continent_code,
                            latitude: geo.latitude?.toString(),
                            longitude: geo.longitude?.toString(),
                        }
                        : null,
                    success,
                    reason
                });
            };

            // Ensure publicId
            if (!user.publicId) {
                const uniqueId = nanoid(6);
                const updatedUser = await User.findByIdAndUpdate(
                    user._id,
                    { publicId: `${user.fullName.split(' ')[0].toLowerCase()}-${uniqueId}` },
                    { new: true }
                );
                user.publicId = updatedUser.publicId;
            }

            // Log successful GitHub login
            await logLoginActivity({
                user: user._id,
                req,
                success: true,
                reason: null
            });

            const userData = {
                success: true,
                message: 'Login successful!',
                authProvider: 'github',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    publicId: user.publicId,
                    subscription: subscriptionInfo,
                    hasGivenOnboardingFeedback: user.hasGivenOnboardingFeedback
                }
            };

            const userDataString = encodeURIComponent(JSON.stringify(userData));
            res.redirect(`https://pairly.chat/verify?userData=${userDataString}`);

        } catch (error) {
            console.error('GitHub login error:', error);
            return res.redirect('/login');
        }
    }
);

module.exports = router;
