async function cancelHandler(io, socket, PrivateChatRequest) {
    socket.on('privateChat:cancel', async (partnerSocketId) => {
        try {
            const currentUserId = socket.userId;
            let partnerUserId = null;
            let partnerSocket = null;

            // If socket ID is provided, get partner
            if (partnerSocketId) {
                partnerSocket = io.sockets.sockets.get(partnerSocketId);
                partnerUserId = partnerSocket?.userId;
            }

            // If no partner info, find from DB
            let request = await PrivateChatRequest.findOne({
                $or: [
                    { from: currentUserId, status: 'pending' },
                    { to: currentUserId, status: 'pending' }
                ]
            });

            if (!request) {
                socket.emit('privateChat:error', { message: 'No pending request found.' });
                return;
            }

            // Identify partner user
            partnerUserId =
                request.from.toString() === currentUserId.toString()
                    ? request.to
                    : request.from;

            // Update status
            request.status = 'cancelled';
            await request.save();

            // Notify both users
            if (!partnerSocket) {
                partnerSocket = [...io.sockets.sockets.values()]
                    .find(s => s.userId?.toString() === partnerUserId.toString());
            }

            if (partnerSocket) {
                partnerSocket.emit('privateChat:requestCancelled', request);
            }

            socket.emit('privateChat:requestCancelled', request);

        } catch (err) {
            console.error(err);
            socket.emit('privateChat:error', { message: 'Failed to cancel request.' });
        }
    });
}

module.exports = cancelHandler;
