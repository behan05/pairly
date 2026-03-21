const Message = require('../../models/chat/Message.model');
const Conversation = require('../../models/chat/Conversation.model');
const { getIO } = require('../../sockets/socketServer');
const {
    uploadChatVoice,
    uploadImage,
    uploadAudio,
    uploadVideo,
    uploadDocument
} = require('../../services/media.service');

/**
 * Handles media upload for random chat.
 * - Validates user and media.
 * - Finds or creates a random chat conversation.
 * - Saves the Cloudinary public URL in the message.
 * - Emits the message to the partner via socket.
 * - Returns the saved message data.
 */
exports.uploadRandomChatMediaController = async (req, res) => {
    const userId = req.user?.id;
    const media = req.file;
    const { partnerSocketId, flag } = req.body;
    const io = getIO();

    // Validate user authentication
    if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized: User ID is missing' });
    }

    // Validate uploaded media file
    if (!media) {
        return res.status(400).json({ success: false, error: 'No media file provided' });
    }

    try {
        // Find the socket of the connected random chat partner
        let partnerSocket = io.sockets.sockets.get(partnerSocketId);
        let partnerId = partnerSocket?.userId;

        // Handle case where partner is not connected
        if (!partnerId) {
            return res.status(400).json({ success: false, error: `Partner with ID ${partnerId} is not connected` });
        }

        // Look for an active random chat conversation between the two users
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, partnerId] },
            isActive: true,
            mode: 'random'
        });

        // If conversation doesn't exist, create it
        if (!conversation) {
            conversation = new Conversation({
                participants: [userId, partnerId],
                isActive: true,
                mode: 'random'
            });
            await conversation.save();
        }

        // Determine the message type based on mimetype
        const getType = (mimetype) => {
            if (mimetype.startsWith('image/')) return 'image';
            if (mimetype.startsWith('video/')) return 'video';
            if (mimetype.startsWith('audio/')) return 'audio';
            return 'file';
        };

        const messageType = getType(media.mimetype);

        // capture upload result
        let uploadResult;

        switch (messageType) {
            case 'image':
                uploadResult = await uploadImage(media);
                break;

            case 'video':
                uploadResult = await uploadVideo(media);
                break;

            case 'audio':
                uploadResult = flag === 'voice'
                    ? await uploadChatVoice(media)
                    : await uploadAudio(media)
                break;

            case 'file':
                uploadResult = await uploadDocument(media)
                break;

            default:
                return res.status(400).json({
                    success: 'false',
                    error: 'Unsupported media type'
                })
        }

        const { secure_url, public_id } = uploadResult;

        // Create a new message instance and save to DB
        // Set a deleteAt date for the message to expire after 30 days
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        const newMessage = await Message.create({
            conversation: conversation._id,
            sender: userId,
            content: secure_url,
            messageType,
            publicMediaId: public_id,
            delivered: true,
            seen: false,
            deleteAt: new Date(Date.now() + THIRTY_DAYS),
        });

        // Emit the media message to the partner in real-time
        partnerSocket.emit('random:message', {
            message: secure_url,
            fileName: media.originalname || '',
            senderId: userId,
            type: messageType,
            timestamp: newMessage.createdAt,
        });

        // Send success response to sender
        return res.status(200).json({
            success: true,
            message: 'Media uploaded successfully',
            resData: {
                sender: newMessage.sender,
                content: newMessage.content,
                fileName: media.originalname || '',
                messageType: newMessage.messageType,
                publicMediaId: newMessage.publicMediaId,
                delivered: newMessage.delivered,
                seen: newMessage.seen,
                createdAt: newMessage.createdAt,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal server error: ${error.message}`,
        });
    }
};
