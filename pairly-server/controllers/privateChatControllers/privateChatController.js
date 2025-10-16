const User = require('../../models/User.model');
const Profile = require('../../models/Profile.model');
const Settings = require('../../models/settings.model');
const Conversation = require('../../models/chat/Conversation.model');
const Message = require('../../models/chat/Message.model');
const Block = require('../../models/chat/Block.model');
const PrivateChatRequest = require('../../models/chat/PrivateChatRequest.model');
const ChatClearLog = require('../../models/chat/ChatClearLog.model');
const { getIO } = require('../../sockets/socketServer');

exports.listPrivateChatUsersController = async (req, res) => {
    const currentUserId = req.user.id?.toString();

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

        let allFriendsId = currentUserFriends.map(f =>
            f.from.toString() === currentUserId ? f.to : f.from
        );

        const blockedUsers = await Block.find({
            isRandomChat: false,
            $or: [
                { blocker: currentUserId, blocked: { $in: allFriendsId } },
                { blocked: currentUserId, blocker: { $in: allFriendsId } }
            ]
        }).lean();

        const blockedIds = blockedUsers.map(b =>
            b.blocker.toString() === currentUserId
                ? b.blocked.toString()
                : b.blocker.toString()
        );

        allFriendsId = allFriendsId.filter(id => !blockedIds.includes(id.toString()));

        if (!allFriendsId.length) {
            return res.status(200).json({
                success: true,
                message: 'No private chat users available (all blocked)',
                users: []
            });
        }

        const profiles = await Profile.find({ user: { $in: allFriendsId } }).lean();
        const settings = await Settings.find({ user: { $in: allFriendsId } }).lean();
        const users = await User.find({ _id: { $in: allFriendsId } }).lean();

        const conversations = await Conversation.find({
            isRandomChat: false,
            participants: currentUserId
        }).lean();

        const conversationIds = conversations.map(c => c._id);

        const clearLogs = await ChatClearLog.find({
            user: currentUserId,
            conversation: { $in: conversationIds }
        }).lean();

        const clearLogsMap = {};
        clearLogs.forEach(log => {
            clearLogsMap[log.conversation.toString()] = log.clearTimestamp;
        });

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

        // ✅ FIXED unread count aggregation
        const unreadCounts = await Message.aggregate([
            {
                $match: {
                    conversation: { $in: conversationIds },
                    seen: false
                }
            },
            {
                $addFields: {
                    senderStr: { $toString: "$sender" }
                }
            },
            {
                $match: {
                    senderStr: { $ne: currentUserId }
                }
            },
            {
                $group: {
                    _id: "$conversation",
                    count: { $sum: 1 }
                }
            }
        ]);

        const unreadCountsMap = {};
        unreadCounts.forEach(u => {
            unreadCountsMap[u._id.toString()] = u.count;
        });

        const userDetails = allFriendsId.map(friendId => {
            const reqProfile = profiles.find(p => p.user.toString() === friendId.toString());
            const reqSettings = settings.find(s => s.user.toString() === friendId.toString());
            const reqUsers = users.find(s => s._id.toString() === friendId.toString());

            const convo = conversations.find(c =>
                c.participants.some(p => p.toString() === friendId.toString())
            );

            const lastMessage = convo ? lastMessagesMap[convo._id.toString()] || null : null;
            const unreadCount = convo ? unreadCountsMap[convo._id.toString()] || 0 : 0;

            return {
                userId: friendId,
                profile: reqProfile || null,
                settings: reqSettings || null,
                isUserVerifiedByEmail: reqUsers?.emailVerified || false,
                conversationId: convo?._id || null,
                lastMessage,
                lastMessageTime: lastMessage ? lastMessage.createdAt : null,
                unreadCount
            };
        });

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

exports.getUnreadCountsController = async (req, res) => {
    const currentUserId = req.user.id.toString();

    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: access token is missing'
        });
    }

    try {
        // Get all conversations where current user is a participant
        const conversations = await Conversation.find({
            participants: currentUserId,
            isRandomChat: false
        }).lean();

        const conversationIds = conversations.map(c => c._id);

        // Aggregate unread messages count per conversation
        const unreadCounts = await Message.aggregate([
            {
                $match: {
                    conversation: { $in: conversationIds },
                    seen: false
                }
            },
            {
                $addFields: {
                    senderStr: { $toString: "$sender" }
                }
            },
            {
                $match: {
                    senderStr: { $ne: currentUserId.toString() }
                }
            },
            {
                $group: {
                    _id: "$conversation",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert to a map for easier use in frontend
        const unreadCountsMap = {};
        unreadCounts.forEach(u => {
            unreadCountsMap[u._id.toString()] = { count: u.count };
        });

        return res.status(200).json({
            success: true,
            data: unreadCountsMap
        });

    } catch (error) {
        console.error('Error fetching unread counts:', error);
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

exports.uploadPrivateChatMediaController = async (req, res) => {
    const currentUserId = req.user.id;
    let { conversationId } = req.body;

    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: access token is missing'
        });
    }

    // Accept conversationId as object or string
    if (typeof conversationId === 'object' && conversationId !== null) {
        conversationId = conversationId._id || conversationId.id || conversationId.toString();
    }

    if (!conversationId || typeof conversationId !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'conversationId is required and must be a string'
        });
    }

    const media = req.file;
    if (!media) {
        return res.status(400).json({
            success: false,
            error: 'No media file uploaded'
        });
    }

    try {
        // Verify conversation and membership
        const conversation = await Conversation.findOne({
            _id: conversationId,
            isRandomChat: false,
            participants: currentUserId
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        // Determine message type
        const getType = (mimetype) => {
            if (!mimetype) return 'file';
            if (mimetype.startsWith('image/')) return 'image';
            if (mimetype.startsWith('video/')) return 'video';
            if (mimetype.startsWith('audio/')) return 'audio';
            return 'file';
        };

        const messageType = getType(media.mimetype);

        // Cloud URL (multer/cloud adapter should set url or path)
        const cloudinaryUrl = media.url || media.path || null;
        if (!cloudinaryUrl) {
            return res.status(500).json({ success: false, error: 'Media upload failed, no URL returned' });
        }

        // Create message record
        const newMessage = await Message.create({
            conversation: conversationId,
            sender: currentUserId,
            content: cloudinaryUrl,
            messageType,
            publicMediaId: req.file.filename
        });

        // Emit socket event to the conversation room so clients reconcile optimistic messages
        try {
            const io = getIO();
            // compute roomId consistent with socket join logic: sorted participant ids joined by '-'
            const participantIds = (conversation.participants || []).map(p => p.toString());
            const roomId = participantIds.sort().join('-');

            const emittedMessage = {
                _id: newMessage._id.toString(),
                content: newMessage.content,
                sender: newMessage.sender.toString ? newMessage.sender.toString() : String(newMessage.sender),
                messageType: newMessage.messageType || messageType,
                publicMediaId: newMessage.publicMediaId || null,
                createdAt: newMessage.createdAt ? newMessage.createdAt.toISOString() : new Date().toISOString(),
                timestamp: newMessage.createdAt ? newMessage.createdAt.toISOString() : new Date().toISOString(),
            };

            // Emit to room so both participants receive the message
            io.to(roomId).emit('privateChat:message', {
                conversationId: String(conversationId),
                message: emittedMessage
            });
        } catch (emitErr) {
            console.error('Socket emit error (media):', emitErr);
        }

        return res.status(201).json({
            success: true,
            message: 'Media uploaded successfully',
            data: newMessage
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Error while uploading media',
            details: error.message
        });
    }
};



