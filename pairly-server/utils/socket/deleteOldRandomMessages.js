const Message = require('../../models/chat/Message.model');
// const deleteMediaFromCloudinary = require('../cloudinary/deleteMedia');

/**
 * Deletes all messages from the database where the `deleteAt` date has passed (older than current time).
 * Also deletes associated media from Cloudinary if available.
 * Only messages from conversations marked as `isRandomChat: true` are affected.
 * This function is intended to be run periodically via a scheduled cron job (e.g., every 24 hours).
 *
 * @returns {Promise<void>}
 */

async function deleteExpiredRandomMessages() {
    const now = new Date();

    // Geting expired messages with populated conversation
    const expiredMessages = await Message.find({ deleteAt: { $lte: now } })
        .populate('conversation');

    // Filtering only those where the related conversation is a random chat
    const randomExpiredMessages = expiredMessages.filter(
        msg => msg.conversation?.isRandomChat === true
    );

    // Delete media (if any)
    for (let msg of randomExpiredMessages) {
        if (msg.publicMediaId) {
            try {
                await deleteMediaFromCloudinary(msg.publicMediaId);
            } catch (_) {
                continue;
            }
        }
    }

    // Delete the messages
    const idsToDelete = randomExpiredMessages.map(msg => msg._id);
    if (idsToDelete.length > 0) {
        await Message.deleteMany({ _id: { $in: idsToDelete } });
    }
}

module.exports = deleteExpiredRandomMessages;
