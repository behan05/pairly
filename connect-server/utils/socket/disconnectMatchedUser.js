
async function disconnectMatchedUser(socket, io, activeMatches, waitingQueue, Conversation) {
    //  Get current user's ID (must be set at connection time)
    const userId = socket.userId;

    //  Check if user is currently matched with someone
    const partnerId = activeMatches.get(socket.id);

    if (partnerId) {
        // Get partner's socket instance
        const partnerSocket = io.sockets.sockets.get(partnerId);
        const partnerUserId = partnerSocket?.userId;

        if (partnerSocket) {
            // Notify partner about disconnection
            partnerSocket.emit('random:partner-disconnected');
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
