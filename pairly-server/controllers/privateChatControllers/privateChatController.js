const User = require('../../models/User.model');
const Profile = require('../../models/Profile.model');
const Conversation = require('../../models/chat/Conversation.model');
const Message = require('../../models/chat/Message.model');
const Block = require('../../models/chat/Block.model');
const PrivateChatRequest = require('../../models/chat/PrivateChatRequest.model');
const ChatClearLog = require('../../models/chat/ChatClearLog.model');

exports.listPrivateChatUsersController = async (req, res) => {
    const currentUserId = req.user.id;

    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: access token is missing'
        });
    }

    try {
        const CurrentUser = await User.findById(currentUserId).lean();
        if (!CurrentUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Find all accepted chat requests where user is involved
        const currentUserFriends = await PrivateChatRequest.find({
            $or: [
                { to: currentUserId },
                { from: currentUserId }
            ],
            status: 'accepted'
        }).sort({ createdAt: -1 }).lean();

        if (!currentUserFriends.length) {
            return res.status(200).json({
                success: true,
                message: 'There are no private chat users available',
                users: []
            });
        }

        // Extract friend IDs
        let allFriendsId = currentUserFriends.map(f =>
            f.from.toString() === currentUserId.toString() ? f.to : f.from
        );

        // Get blocked users (both directions)
        const blockedUsers = await Block.find({
            isRandomChat: false,
            $or: [
                { blocker: currentUserId, blocked: { $in: allFriendsId } },
                { blocked: currentUserId, blocker: { $in: allFriendsId } }
            ]
        }).lean();

        // Collect blocked IDs
        const blockedIds = blockedUsers.map(b =>
            b.blocker.toString() === currentUserId.toString()
                ? b.blocked.toString()
                : b.blocker.toString()
        );

        // Filter out blocked users
        allFriendsId = allFriendsId.filter(id => !blockedIds.includes(id.toString()));

        if (!allFriendsId.length) {
            return res.status(200).json({
                success: true,
                message: 'No private chat users available (all blocked)',
                users: []
            });
        }

        // Get profiles of allowed friends
        const profiles = await Profile.find({ user: { $in: allFriendsId } }).lean();

        // Get conversations where current user is a participant
        const conversations = await Conversation.find({
            isRandomChat: false,
            participants: currentUserId
        }).lean();

        const conversationIds = conversations.map(c => c._id);

        // get clear logs for this user
        const clearLogs = await ChatClearLog.find({
            user: currentUserId,
            conversation: { $in: conversationIds }
        }).lean();

        // make a map for fast lookup
        const clearLogsMap = {};
        clearLogs.forEach(log => {
            clearLogsMap[log.conversation.toString()] = log.clearTimestamp;
        });

        // Get last message for each conversation
        const lastMessages = await Message.aggregate([
            { $match: { conversation: { $in: conversationIds } } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$conversation",
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        // filter by clear timestamp
        const lastMessagesMap = {};
        lastMessages.forEach(m => {
            const convId = m._id.toString();
            const clearTime = clearLogsMap[convId];

            if (clearTime && m.lastMessage.createdAt <= clearTime) {
                lastMessagesMap[convId] = null;
            } else {
                lastMessagesMap[convId] = m.lastMessage;
            }
        });

        // Build user details
        const userDetails = allFriendsId.map(friendId => {
            const reqProfile = profiles.find(p => p.user.toString() === friendId.toString());

            const convo = conversations.find(c =>
                c.participants.some(p => p.toString() === friendId.toString())
            );

            const lastMessage = convo ? lastMessagesMap[convo._id.toString()] || null : null;

            return {
                userId: friendId,
                profile: reqProfile || null,
                conversationId: convo?._id || null,
                lastMessage,
                lastMessageTime: lastMessage ? lastMessage.createdAt : null
            };
        });

        // Sort by lastMessageTime (latest first)
        userDetails.sort((user1, user2) => {
            if (!user1?.lastMessageTime && !user2?.lastMessageTime) return 0;
            if (!user1?.lastMessageTime) return 1;
            if (!user2?.lastMessageTime) return -1;
            return new Date(user2.lastMessageTime) - new Date(user1.lastMessageTime);
        });

        return res.status(200).json({
            success: true,
            users: userDetails
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Server error. Please try again later.'
        });
    }
};

exports.getConversationMessagesController = async (req, res) => {
    const currentUserId = req.user.id;

    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: access token is missing'
        });
    }

    const { conversationId } = req.params;
    if (!conversationId) return res.status(400).json({ success: false, error: 'conversationId required' });

    try {
        // Get clear timestamp for this user/conversation
        const clearLog = await ChatClearLog.findOne({ user: currentUserId, conversation: conversationId });

        let filter = {
            conversation: conversationId
        };
        if (clearLog && clearLog.clearTimestamp) {
            filter.createdAt = {
                $gt: clearLog.clearTimestamp
            };
        }

        const messages = await Message.find(filter).sort({ createdAt: 1 });
        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

exports.clearPrivateChatMessageControllerById = async (req, res) => {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;

    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: access token is missing'
        });
    }

    if (!conversationId) {
        return res.status(400).json({
            success: false,
            error: 'Error: conversationId must be required'
        });
    }

    try {
        // Find the conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            isRandomChat: false,
            participants: currentUserId
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: "Conversation not found"
            });
        }

        // Save or update the clear timestamp for this user/conversation
        await ChatClearLog.findOneAndUpdate(
            { user: currentUserId, conversation: conversationId },
            { clearTimestamp: new Date() },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Chat cleared from your view. Messages are retained for 90 days as per policy."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Error occurred while marking chat as cleared",
            details: error.message
        });
    }
}

exports.deletePrivateChatWithUserControllerById = async (req, res) => {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;

    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: access token is missing'
        });
    }

    if (!conversationId) {
        return res.status(400).json({
            success: false,
            error: 'Error: conversationId must be required'
        });
    }

    try {
        // Find the conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            isRandomChat: false,
            participants: currentUserId
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: "Conversation not found"
            });
        }

        // Get both participants
        const participants = conversation.participants.map(id => id.toString());

        // Delete all accepted friend requests between these two users
        await PrivateChatRequest.deleteMany({
            from: { $in: participants },
            to: { $in: participants },
            status: 'accepted'
        });

        // Delete the conversation (messages will be retained due to TTL)
        const result = await Conversation.deleteOne({ _id: conversation._id });

        if (result.deletedCount === 0) {
            return res.status(500).json({
                success: false,
                error: "Failed to delete conversation"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Conversation and friend request deleted for both users. Messages are retained (TTL applies)."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Error occurred while deleting conversation model",
            details: error.message
        });
    }
};

