// ==============================
// Core User & Profile Models
// ==============================
const User = require('../../models/User.model');
const Profile = require('../../models/Profile.model');

// ==============================
// Activity & Security Tracking
// ==============================
const UserActivity = require('../../models/UserActivity.model');
const LoginActivity = require('../../models/LoginActivity.model');

// ==============================
// Subscription & Payments
// ==============================
const Subscription = require('../../models/payment/Subscription.model');

// ==============================
// Feedback, Reports & Support
// ==============================
const Feedback = require('../../models/feedback/Feedback.model');
const ReportProblem = require('../../models/ReportProblem.model');
const SupportTicket = require('../../models/SupportTicket.model');

// ==============================
// Chat & Communication
// ==============================
const Conversation = require('../../models/chat/Conversation.model');
const Message = require('../../models/chat/Message.model');
const PrivateChatRequest = require('../../models/chat/PrivateChatRequest.model');

// ==============================
// Moderation & Safety
// ==============================
const Block = require('../../models/chat/Block.model');
const ChatUserReport = require('../../models/chat/ChatUserReport.model');

// ==============================
// Mongoose ObjectId
// ==============================
const mongoose = require('mongoose');

exports.adminDashboardStatsController = async (req, res) => {
    // const currentUserId = req?.user?.id;
    // const currentUserRole = req?.user?.role;

    // if (!currentUserId || currentUserRole !== 'admin') {
    //     return res.status(401).json({
    //         success: false,
    //         error: 'Unauthorized access'
    //     });
    // }

    try {

        // Getting total number of users
        const totalUsers = await User.countDocuments({});

        // number of Active Users Today
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);

        const activeUsersToday = await User.countDocuments({
            lastSeen: { $gte: todayStart }
        });

        // number of New Users (Last 24 hours)
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const newUsersLast24Hours = await User.countDocuments({
            createdAt: { $gte: last24Hours }
        });

        // number of Online Users Now
        const activeUserNow = await User.countDocuments({
            isOnline: true
        });

        // Total Premium Subscribers
        const totalPremiumSubsriptions = await Subscription.countDocuments({
            plan: { $in: ['premium', 'superPremium'] },
            status: 'active'
        });

        // Premium Subscribers (Last 24 hours)
        const newPremiumUserLast24Hours = await Subscription.countDocuments({
            createdAt: { $gte: last24Hours },
            status: 'active',
            plan: { $in: ['premium', 'superPremium'] }
        });

        // Reports Submitted Today
        const newReportsToday = await ReportProblem.countDocuments({
            createdAt: { $gte: todayStart }
        });

        // Supports Ticket Submitted Today 
        const newSupportTicketsToday = await SupportTicket.countDocuments({
            createdAt: { $gte: todayStart }
        });

        // Supports Ticket pending Submitted
        const totalSupportInPendingOrInProcessState = await SupportTicket.countDocuments({
            status: { $in: ['pending', 'in-progress'] }
        });

        // Total Random Chats Started
        const totalRandomChatsStarted = await Conversation.countDocuments({
            isRandomChat: true,
        });

        // Total Private Chats Started
        const totalPrivateChatsStarted = await Conversation.countDocuments({
            isRandomChat: false,
        });

        // Active Matches Today
        const activeMatchesToday = await Message.distinct('conversation', {
            createdAt: { $gte: todayStart }
        }).then(ids => ids.length);

        const payload = {
            totalUsers,
            activeUsersToday,
            newUsersLast24Hours,
            activeUserNow,
            totalPremiumSubsriptions,
            newPremiumUserLast24Hours,
            newReportsToday,
            newSupportTicketsToday,
            totalSupportInPendingOrInProcessState,
            totalRandomChatsStarted,
            totalPrivateChatsStarted,
            activeMatchesToday
        };

        return res.status(200).json({
            success: true,
            payload
        });
    } catch (error) {
        console.error('Error in adminDashboardStatsController:', error);
        return res.status(500).json({
            success: false,
            error: 'Server Error',
            details: error.message
        });
    }

}

exports.adminDashboardTopUsersController = async (req, res) => {
    // const currentUserId = req?.user?.id;
    // const currentUserRole = req?.user?.role;

    // if (!currentUserId || currentUserRole !== 'admin') {
    //     return res.status(401).json({
    //         success: false,
    //         error: 'Unauthorized access'
    //     });
    // }

    try {

        /**
         * Logic priority (weight):
         * 1. Most active chats
         * 2. Messages sent
         * 3. Last active time
         * 4. Matches / connections made
         * 5. Account age (tie-breaker)
         */

        const topUsers = await User.aggregate([
            // Join conversations
            {
                $lookup: {
                    from: 'conversations',
                    localField: '_id',
                    foreignField: 'participants',
                    as: 'conversations'
                }
            },

            // Join messages
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'sender',
                    as: 'messages'
                }
            },

            // Compute metrics
            {
                $addFields: {
                    totalConversations: { $size: '$conversations' },
                    totalMessages: { $size: '$messages' },
                    lastActiveAt: '$lastSeen',
                    accountAge: '$createdAt'
                }
            },

            // Sorting based on priority
            {
                $sort: {
                    totalConversations: -1,
                    totalMessages: -1,
                    lastActiveAt: -1,
                    accountAge: 1
                }
            },

            // Limit to top 5
            { $limit: 5 },

            // Getting profile image
            {
                $lookup: {
                    from: 'profiles',          // collection name (IMPORTANT)
                    localField: '_id',          // User._id
                    foreignField: 'user',       // Profile.user
                    as: 'profile'
                }
            },
            {
                $unwind: {
                    path: '$profile',
                    preserveNullAndEmptyArrays: true
                }
            },

            // Select only required fields for dashboard
            {
                $project: {
                    _id: 1,
                    fullName: 1,
                    email: 1,
                    publicId: 1,
                    profileImage: '$profile.profileImage',
                    isOnline: 1,
                    lastSeen: 1,

                    totalConversations: 1,
                    totalMessages: 1,
                    createdAt: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            payload: topUsers
        });

    } catch (error) {
        console.error('Error in adminDashboardTopUsersController:', error);
        return res.status(500).json({
            success: false,
            error: 'Server Error',
            details: error.message
        });
    }
};

exports.adminDashboardFinancialAndBillingOverviewController = async (req, res) => {
    // const currentUserId = req?.user?.id;
    // const currentUserRole = req?.user?.role;

    // if (!currentUserId || currentUserRole !== 'admin') {
    //     return res.status(401).json({
    //         success: false,
    //         error: 'Unauthorized access'
    //     });
    // };

    try {
        // =================== Monthly Revenue ====================
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const subscriptionForMonthlyRevenu = await Subscription.find({
            plan: { $in: ['premium', 'superPremium'] },
            status: 'active',
            createdAt: { $gte: startOfMonth }
        }).lean();

        const monthlyRevenue = subscriptionForMonthlyRevenu.reduce(
            (sum, s) => sum + (s.amount || 0),
            0
        );

        // =================== Weekly Revenue ====================
        const sevenDayBack = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const subscriptionForSevenDaysRevenue = await Subscription.find({
            plan: { $in: ['premium', 'superPremium'] },
            status: 'active',
            createdAt: { $gte: sevenDayBack }
        }).lean();

        const weeklyRevenue = subscriptionForSevenDaysRevenue.reduce(
            (sum, s) => sum + (s.amount || 0),
            0
        );

        // =================== New Subscribers (Weekly) ====================
        const newSubscriberWeekly = await Subscription.countDocuments({
            plan: { $in: ['premium', 'superPremium'] },
            status: 'active',
            createdAt: { $gte: sevenDayBack }
        });

        // =================== Total Payment Failures ====================
        const totalPaymentFailures = await Subscription.countDocuments({
            status: 'failed'
        });

        // =================== Monthly Payment Failures ====================
        const monthlyPaymentFailures = await Subscription.countDocuments({
            status: 'failed',
            createdAt: { $gte: startOfMonth }
        });

        // =================== Renewal Rate (Last 30 Days) ====================
        const periodStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Expired paid subscriptions in last 30 days
        const expiredSubscriptions = await Subscription.countDocuments({
            plan: { $in: ['premium', 'superPremium'] },
            status: 'expired',
            endDate: { $gte: periodStart }
        });

        // Renewed subscriptions in last 30 days
        const renewedSubscriptions = await Subscription.countDocuments({
            plan: { $in: ['premium', 'superPremium'] },
            status: 'active',
            renewal: true,
            startDate: { $gte: periodStart }
        });

        // Renewal Rate calculation
        const renewalRate = expiredSubscriptions > 0
            ? Number(((renewedSubscriptions / expiredSubscriptions) * 100).toFixed(2))
            : 0;

        return res.status(200).json({
            success: true,
            payload: {
                monthlyRevenue,
                weeklyRevenue,
                newSubscriberWeekly,
                totalPaymentFailures,
                monthlyPaymentFailures,
                renewalRate
            }
        });

    } catch (error) {
        console.error('Error in adminDashboardFinancialAndBillingOverviewController:', error);
        return res.status(500).json({
            success: false,
            error: 'Server Error',
            details: error.message
        });
    }
};
