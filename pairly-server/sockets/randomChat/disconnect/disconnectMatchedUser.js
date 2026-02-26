// const deleteMediaFromCloudinary = require('../../utils/cloudinary/deleteMedia');

/**
 * Handles user disconnection from a random chat match.
 * - Notifies the partner user
 * - Deletes all messages and associated media from the conversation after 1 month
 * - Marks the conversation as inactive
 * - Maintains participant IDs for future match tracking
 * 
 * @param {Object} socket - The disconnecting user's socket instance
 * @param {Object} io - The Socket.IO server instance
 * @param {Map} activeMatches - Map of active user socket pairs
 * @param {Array} waitingQueue - Queue of users waiting for match
 * @param {Model} Conversation - Mongoose model for conversations
 * @param {Model} Message - Mongoose model for messages
 */

async function disconnectMatchedUser(
    socket,
    io,
    activeMatches,
    waitingQueue,
    Conversation,
    Message
) {
    const userId = socket.userId;
    const partnerId = activeMatches.get(socket.id);

    if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        const partnerUserId = partnerSocket?.userId;

        // Notify the matched partner about disconnection
        if (partnerSocket) {
            partnerSocket.emit('random:partner-disconnected');
        }

        try {
            if (userId && partnerUserId) {
                const conversation = await Conversation.findOne({
                    participants: { $all: [userId, partnerUserId] },
                    isRandomChat: true,
                    isActive: true
                }).sort({ createdAt: -1 });

                if (!conversation) return;

                const messages = await Message.find({ conversation: conversation._id });

                // Delete all media files uploaded during the conversation
                for (let msg of messages) {
                    try {
                        if (msg.publicMediaId && msg.publicMediaId.trim() !== '') {
                            await deleteMediaFromCloudinary(msg.publicMediaId)
                            await Message.findByIdAndDelete(msg._id)
                        }
                    } catch (_) {
                        continue;
                    }
                }
            }
        } catch (_) {
            return;
        }

        // Mark the current conversation as inactive for future tracking
        if (userId && partnerUserId) {
            try {
                await Conversation.findOneAndUpdate(
                    {
                        participants: { $all: [userId, partnerUserId] },
                        isRandomChat: true,
                    },
                    { isActive: false }
                );
            } catch (err) {
                return;
            }
        }

        // Remove partner from active match map
        activeMatches.delete(partnerId);
    }

    // Remove user from active match map
    activeMatches.delete(socket.id);

    // Remove user from waiting queue if they exist there
    const index = waitingQueue.findIndex(s => s.id === socket.id);
    if (index !== -1) {
        waitingQueue.splice(index, 1);
        console.log(`Removed ${socket.id} from waitingQueue`);
    }
}

module.exports = disconnectMatchedUser;
