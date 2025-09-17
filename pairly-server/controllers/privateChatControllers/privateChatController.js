const User = require('../../models/User.model');
const Profile = require('../../models/Profile.model');
const Conversation = require('../../models/chat/Conversation.model');
const Message = require('../../models/chat/Message.model');
const Block = require('../../models/chat/Block.model');
const PrivateChatRequest = require('../../models/chat/PrivateChatRequest.model');

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

        // Build map conversationId -> lastMessage
        const lastMessagesMap = {};
        lastMessages.forEach(m => {
            lastMessagesMap[m._id.toString()] = m.lastMessage;
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
    };

    const { conversationId } = req.params;
    if (!conversationId) return res.status(400).json({ success: false, error: 'conversationId required' });

    try {
        const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

exports.clearPrivateChatMessageControllerById = async (req, res) => { }
exports.deletePrivateChatWithUserControllerById = async (req, res) => { }
