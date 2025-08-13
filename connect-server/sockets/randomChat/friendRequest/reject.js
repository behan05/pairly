async function rejectHandler(io, socket, PrivateChatRequest) {
    socket.on('privateChat:reject', async (partnerSocketId) => {
        try {
            let partnerSocket = null;
            let partnerUserId = null;

            if (partnerSocketId) {
                partnerSocket = io.sockets.sockets.get(partnerSocketId);
                partnerUserId = partnerSocket?.userId;
            }

            const currentUserId = socket.userId;

            // If partner not connected, try to get from DB directly
            if (!partnerUserId) {
                const pendingRequest = await PrivateChatRequest.findOne({
                    $or: [
                        { from: currentUserId, status: 'pending' },
                        { to: currentUserId, status: 'pending' }
                    ]
                });

                if (!pendingRequest) {
                    socket.emit('random:error', { message: 'No pending request found.' });
                    return;
                }

                partnerUserId =
                    pendingRequest.from.toString() === currentUserId
                        ? pendingRequest.to
                        : pendingRequest.from;
            }

            // Find and update request
            const request = await PrivateChatRequest.findOne({
                $or: [
                    { from: currentUserId, to: partnerUserId, status: 'pending' },
                    { from: partnerUserId, to: currentUserId, status: 'pending' }
                ]
            });

            if (!request) {
                socket.emit('random:error', { message: 'No pending request found.' });
                return;
            }

            request.status = 'rejected';
            await request.save();

            if (partnerSocket) {
                partnerSocket.emit('privateChat:requestRejected', request);
            }
            socket.emit('privateChat:requestRejected', request);

        } catch (err) {
            socket.emit('random:error', { message: 'Failed to reject request' });
        }
    });
}

module.exports = rejectHandler;
