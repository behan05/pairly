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

exports.getAllUsersController = async (req, res) => {
    // const currentUserId = req?.user?.id;
    // const currentUserRole = req?.user?.role;

    // if (!currentUserId || currentUserRole !== 'admin') {
    //     return res.status(401).json({
    //         success: false,
    //         error: 'Unauthorized access'
    //     });
    // }

    try {
        const users = await User.find({}).select('-password');
        if (users.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No users exist',
                users: []
            });
        };

        const profile = await Profile.find({ 'user': { $in: users.map(u => u._id) } }).lean();
        const userLoginActivity = await LoginActivity.find(
            { 'user': { $in: users.map(u => u?._id) } }
        )
            .sort({ created: -1 })
            .lean();

        const payloadUsers = users.map(user => {
            const userProfile = profile.find(p => String(p.user) === String(user._id));
            const loginActivity = userLoginActivity.find(p => String(p?.user) === String(user?._id));

            return {
                ...user._doc,
                profile: userProfile,
                geo: {
                    city: loginActivity?.geo?.city,
                    state: loginActivity?.geo?.state,
                    country: loginActivity?.geo?.country,
                }
            };
        });

        return res.status(200).json({
            success: true,
            users: payloadUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Error retrieving users',
            details: error.message
        });
    }
};

exports.getUserByIdController = async (req, res) => {
    // const currentUserId = req?.user?.id;
    // const currentUserRole = req?.user?.role;

    // if (!currentUserId || currentUserRole !== 'admin') {
    //     return res.status(401).json({
    //         success: false,
    //         error: 'Unauthorized access'
    //     });
    // }

    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'User ID is required'
        });
    }

    // Validate ObjectId (IMPORTANT)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid User ID'
        });
    }

    try {
        // Always use lean for read-only admin APIs
        const user = await User
            .findById(userId)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Get latest subscription if multiple exist
        const subscription = await Subscription.findOne({
            userId: new mongoose.Types.ObjectId(userId)
        })
            .sort({ createdAt: -1 })
            .lean();

        // Get latest Loggedin activity if multiple exist    
        const loginActivity = await LoginActivity.find(
            { user: new mongoose.Types.ObjectId(userId) }
        )
            .sort({ createdAt: -1 })
            .lean();

        // Get user profile    
        const profile = await Profile.find(
            { user: new mongoose.Types.ObjectId(userId) }
        )
            .lean();

        const payload = {
            user,
            subscription: subscription || null,
            loginActivity: loginActivity || null,
            profile: profile,
            activity: null,
        };

        return res.status(200).json({
            success: true,
            userPayload: payload
        });

    } catch (error) {
        console.error('getUserByIdController error:', error);

        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

exports.banUserByIdController = async (req, res) => { };
exports.unbanUserByIdController = async (req, res) => { };
exports.deleteUserByIdController = async (req, res) => { };
