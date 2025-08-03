const deleteMediaFromCloudinary = require('../../utils/cloudinary/deleteMedia');

async function disconnectMatchedUser(
    socket,
    io,
    activeMatches,
    waitingQueue,
    Conversation,
    Message
) {
    //  Get current user's ID
    const userId = socket.userId;

    //  Check if user is currently matched with someone
    const partnerId = activeMatches.get(socket.id);

    if (partnerId) {
        // Get partner's socket instance
        const partnerSocket = io.sockets.sockets.get(partnerId);
        const partnerUserId = partnerSocket?.userId;

        // Notify partner about disconnection
        if (partnerSocket) {
            partnerSocket.emit('random:partner-disconnected');
        }

        /* 
         At this place, we can delete all media files from cloudinary 
        which were uploaded by the user in the current conversation &
        we also delete all messages in the current conversation except 
        the both users id that will be used for private chat listing
        */

        try {
            if (userId && partnerUserId) {
                const conversation = await Conversation.findOne({
                    participants: { $all: [userId, partnerUserId] },
                    isRandomChat: true,
                    isActive: true
                });

                if (!conversation) return;

                const mediaMessage = await Message.find({
                    conversation: conversation._id,
                    content: { $ne: '' },
                    publicId: { $ne: '' }
                });

                for (let msg of mediaMessage) {
                    if (msg.publicId) {
                        await deleteMediaFromCloudinary(msg.publicId);
                    }
                }

                /* 
                Delete the message from the database
                We are not deleting the message if it is not sent by the current user
                because we want to keep the messages for the partner user
                and also we are not deleting the message if it is not sent by the partner user
                */
                await Message.deleteMany(
                    {
                        _id: {
                            $in: mediaMessage.map(msg => msg._id)
                        }
                    }
                )
            }
        } catch (error) {
            console.error('Error deleting media files or messages:', error);
        }

        // Mark the current conversation inactive in DB
        if (userId && partnerUserId) {
            try {
                await Conversation.findOneAndUpdate(
                    {
                        participants: { $all: [userId, partnerUserId] },
                        isRandomChat: true,
                        isActive: true,
                    },
                    { isActive: false }
                );
            } catch (err) {
                console.error('Error updating conversation status:', err);
            }
        }
        // Remove partner from activeMatches map
        activeMatches.delete(partnerId);
    }

    // Remove current user from activeMatches map
    activeMatches.delete(socket.id);

    // Remove user from waiting queue if present
    const index = waitingQueue.findIndex(s => s.id === socket.id);
    if (index !== -1) {
        waitingQueue.splice(index, 1);
        console.log(`Removed ${socket.id} from waitingQueue`);
    }
}

module.exports = disconnectMatchedUser;
