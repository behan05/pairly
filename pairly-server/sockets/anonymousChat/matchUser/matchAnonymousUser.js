
// Anonymous Chat Logic | Algorithm
async function matchAnonymousUser(
    socket,
    waitingQueue,
    activeMatches,
    Profile,
    User,
    Settings,
    Conversation,
    userSocketMap
) {
    socket.userId = String(socket.userId);

    // -----------------------------
    // Clean old data for user
    // -----------------------------
    if (userSocketMap.has(socket.userId)) {
        const oldSocketId = userSocketMap.get(socket.userId);

        // Remove from waiting queue
        for (let i = waitingQueue.length - 1; i >= 0; i--) {
            if (
                waitingQueue[i].userId === socket.userId ||
                waitingQueue[i].id === oldSocketId
            ) {
                waitingQueue.splice(i, 1);
            }
        }

        // Remove old matches
        activeMatches.delete(oldSocketId);
        for (let [key, value] of activeMatches.entries()) {
            if (value === oldSocketId) {
                activeMatches.delete(key);
            }
        }
    }

    // Store new socket ID
    userSocketMap.set(socket.userId, socket.id);

    // -----------------------------
    // Prevent duplicate queue
    // -----------------------------
    const alreadyInQueue = waitingQueue.some(
        s => s.userId === socket.userId
    );

    if (alreadyInQueue) {
        socket.emit("anonymous:waiting");
        return;
    }

    // -----------------------------
    // Ensure profile + settings
    // -----------------------------
    const currentUser = await User.findById(socket.userId).lean();
    if (!currentUser) return;

    let currentProfile = await Profile.findOne({ user: socket.userId });
    if (!currentProfile) {
        currentProfile = await Profile.create({ user: socket.userId });
    }

    let currentSettings = await Settings.findOne({ user: socket.userId });
    if (!currentSettings) {
        currentSettings = await Settings.create({ user: socket.userId });
    }

    // -----------------------------
    // Try to find partner
    // -----------------------------
    for (let i = 0; i < waitingQueue.length; i++) {
        const partnerSocket = waitingQueue[i];

        if (!partnerSocket.userId) continue;
        if (partnerSocket.userId === socket.userId) continue;

        const partnerUser = await User.findById(partnerSocket.userId).lean();
        if (!partnerUser) continue;

        // Create conversation if not exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: [socket.userId, partnerSocket.userId] },
            $expr: {
                $eq: [
                    { $size: '$participants' },
                    2
                ]
            }
        });

        if (!existingConversation) {
            await Conversation.create({
                participants: [socket.userId, partnerSocket.userId],
                mode: "anonymous",
                chatType: "text",
            });
        }

        // Save match
        activeMatches.set(socket.id, partnerSocket.id);
        activeMatches.set(partnerSocket.id, socket.id);

        // Remove partner from queue
        waitingQueue.splice(i, 1);

        // Notify both
        socket.emit("anonymous:matched", {
            partnerId: partnerSocket.userId,
        });

        partnerSocket.emit("anonymous:matched", {
            partnerId: socket.userId,
        });

        // Stop after match
        return;
    }

    // -----------------------------
    // No partner found
    // -----------------------------
    waitingQueue.push(socket);
    socket.emit("anonymous:waiting");
}

module.exports = matchAnonymousUser;