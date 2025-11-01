
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
                isRandomChat: true
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

    // Direct friend request to bypass random chat
    socket.on('friendRequest:directly', async (partnerUserId) => {
        const currentUserId = socket.userId;

        if (!partnerUserId) {
            socket.emit('friend:error', { message: 'Must pass partnerUserId' });
            return;
        }

        try {
            // Find or create a conversation for direct chat
            let conversation = await Conversation.findOne({
                participants: { $all: [currentUserId, partnerUserId] },
                isRandomChat: false, // direct chat
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [currentUserId, partnerUserId],
                    isRandomChat: false,
                });
            }

            // Check if request already exists
            const existing = await PrivateChatRequest.findOne({
                $or: [
                    { from: currentUserId, to: partnerUserId, status: { $in: ['pending', 'accepted'] } },
                    { from: partnerUserId, to: currentUserId, status: { $in: ['pending', 'accepted'] } },
                ],
            });

            if (existing) {
                socket.emit('friend:error', { message: 'Request already pending or accepted.' });
                return;
            }

            // Create new friend request
            const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
            const request = await PrivateChatRequest.findOneAndUpdate(
                { from: currentUserId, to: partnerUserId },
                {
                    $set: {
                        conversation: conversation._id,
                        status: 'pending',
                        deleteAt: new Date(Date.now() + THIRTY_DAYS),
                    },
                },
                { upsert: true, new: true }
            );

            // Notify receiver if online (find socket by userId)
            const partnerSocket = [...io.sockets.sockets.values()].find(
                (s) => String(s.userId) === String(partnerUserId)
            );

            if (partnerSocket) {
                partnerSocket.emit('privateChat:requestReceived', {
                    requestId: request._id,
                    from: currentUserId,
                    status: 'pending',
                    createdAt: request.createdAt,
                });
            }

            // Confirm success to sender
            socket.emit('friend:requestSent', {
                success: true,
                requestId: request._id,
            });

        } catch (err) {
            console.error('friendRequest:directly error:', err);
            socket.emit('friend:error', { message: 'Failed to send friend request.' });
        }
    });
}

module.exports = requestHandler;