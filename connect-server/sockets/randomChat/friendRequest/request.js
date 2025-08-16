
async function requestHandler(io, socket, Conversation, PrivateChatRequest, activeMatches) {
    socket.on('privateChat:request', async () => {
        const currentUserId = socket.userId;
        const partnerSocketId = activeMatches.get(socket.id);

        if (!partnerSocketId) {
            socket.emit('random:error', { message: 'No active match found.' });
            return;
        }

        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        const partnerUserId = partnerSocket?.userId;

        if (!partnerSocket) {
            socket.emit('random:error', { message: 'User is offline.' });
            return;
        }

        if (!partnerUserId) {
            socket.emit('random:error', { message: 'No active match found.' });
            return;
        }

        try {
            const conversation = await Conversation.findOne({
                participants: { $all: [currentUserId, partnerUserId] },
                isRandomChat: true,
                isActive: true,
            });

            if (!conversation) {
                socket.emit('random:error', { message: 'No active match found.' });
                return;
            }

            const existing = await PrivateChatRequest.findOne({
                $or: [
                    { from: currentUserId, to: partnerUserId, status: { $in: ['pending', 'accepted', 'cancelled'] } },
                    { from: partnerUserId, to: currentUserId, status: { $in: ['pending', 'accepted', 'cancelled'] } },
                ],
            });

            if (existing) {
                socket.emit('random:error', { message: 'A request is already pending.' });
                return;
            }

            const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
            // Create or update (upsert) request
            const request = await PrivateChatRequest.findOneAndUpdate(
                {
                    $or: [
                        { from: currentUserId, to: partnerUserId },
                        { from: partnerUserId, to: currentUserId }
                    ]
                },
                {
                    $set: {
                        from: currentUserId,
                        to: partnerUserId,
                        conversation: conversation._id,
                        status: 'pending',
                        deleteAt: new Date(Date.now() + THIRTY_DAYS)
                    }
                },
                { upsert: true, new: true }
            );

            partnerSocket.emit('privateChat:requestReceived', {
                requestId: request._id,
                from: currentUserId,
                status: 'pending',
                createdAt: request.createdAt
            });

        } catch (err) {
            socket.emit('random:error', { message: 'Failed to send request.' });
        }
    });
}

module.exports = requestHandler;