async function acceptHandler(io, socket, PrivateChatRequest) {
    socket.on('privateChat:accept', async () => {
        try {
            const currentUserId = socket.userId;

            // Find pending request for this user
            const request = await PrivateChatRequest.findOne({
                $or: [
                    { from: currentUserId, status: 'pending' },
                    { to: currentUserId, status: 'pending' }
                ]
            });

            if (!request) {
                socket.emit('privateChat:error', { message: 'No pending request found.' });
                return;
            }

            // Determine partner user
            const partnerUserId = request.from.toString() === currentUserId.toString()
                ? request.to
                : request.from;

            // Update request status
            request.status = 'accepted';
            await request.save();

            // Notify partner if connected
            const partnerSocketId = [...io.sockets.sockets]
                .find(([id, s]) => s.userId?.toString() === partnerUserId.toString())?.[0];

            if (partnerSocketId) {
                io.to(partnerSocketId).emit('privateChat:requestAccepted', request);
            }

            // Notify current user
            socket.emit('privateChat:requestAccepted', request);

        } catch (err) {
            console.error(err);
            socket.emit('privateChat:error', { message: 'Failed to accept request.' });
        }
    });
}

module.exports = acceptHandler;
