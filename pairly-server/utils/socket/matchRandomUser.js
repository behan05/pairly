/**
 * Attempts to match a user with another random user in the waiting queue.
 * - Prevents duplicate matches or queue entries
 * - Emits match info to both users if a partner is found
 * - Falls back to waiting if no match is available
 * - Ensures default Settings document exists for each user
 */

async function matchRandomUser(
    socket,
    waitingQueue,
    activeMatches,
    Profile,
    Block,
    User,
    Settings,
    userSocketMap
) {
    // Ensure the socket has its userId stored
    socket.userId = String(socket.userId);

    // --- Clean old entries for this user ---
    if (userSocketMap.has(socket.userId)) {
        const oldSocketId = userSocketMap.get(socket.userId);

        // Remove from waiting queue
        for (let i = waitingQueue.length - 1; i >= 0; i--) {
            if (waitingQueue[i].userId === socket.userId || waitingQueue[i].id === oldSocketId) {
                waitingQueue.splice(i, 1);
            }
        }

        // Remove old matches
        activeMatches.delete(oldSocketId);
        for (const [key, value] of activeMatches.entries()) {
            if (value === oldSocketId) activeMatches.delete(key);
        }
    }

    // --- Store new socket ID for user ---
    userSocketMap.set(socket.userId, socket.id);

    // --- Prevent duplicate queue entries ---
    const alreadyInQueue = waitingQueue.some(s => s.userId === socket.userId);
    if (alreadyInQueue) {
        socket.emit('random:waiting');
        return;
    }

    // --- Get profile and settings ---
    const currentUserProfile = await Profile.findOne({ user: socket.userId }).lean();
    const currentUser = await User.findById(socket.userId).lean();
    if (!currentUserProfile) return;

    let currentUserSettings = await Settings.findOne({ user: socket.userId });
    if (!currentUserSettings) {
        currentUserSettings = new Settings({ user: socket.userId });
        await currentUserSettings.save();
    }

    // --- Try to find partner ---
    for (let i = 0; i < waitingQueue.length; i++) {
        const partnerSocket = waitingQueue[i];

        // Safety check: ensure partnerSocket has userId
        if (!partnerSocket.userId) continue;

        // Skip self-match
        if (partnerSocket.userId === socket.userId) continue;

        const partnerProfile = await Profile.findOne({ user: partnerSocket.userId }).lean();
        const partnerUser = await User.findById(partnerSocket.userId).lean();
        if (!partnerProfile || !partnerUser) continue;

        let partnerSettings = await Settings.findOne({ user: partnerSocket.userId });
        if (!partnerSettings) {
            partnerSettings = new Settings({ user: partnerSocket.userId });
            await partnerSettings.save();
        }

        // Check block conditions
        const blockUsers = await Block.findOne({
            $or: [
                { blocker: socket.userId, blocked: partnerSocket.userId },
                { blocker: partnerSocket.userId, blocked: socket.userId }
            ]
        }).lean();

        if (blockUsers) {
            waitingQueue.push(socket);
            return;
        }

        // Save both matches
        activeMatches.set(socket.id, partnerSocket.id);
        activeMatches.set(partnerSocket.id, socket.id);

        // Helper to emit match info
        const emitMatch = (toSocket, partnerData) => {
            toSocket.emit('random:matched', {
                partnerId: partnerData.id,
                partnerProfile: {
                    fullName: partnerData.fullName,
                    profileImage: partnerData.profileImage,
                    age: partnerData.age,
                    gender: partnerData.gender,
                    pronouns: partnerData.pronouns,
                    bio: partnerData.bio,
                    interests: partnerData.interests,
                    personalityType: partnerData.personalityType,
                    lookingFor: partnerData.lookingFor,
                    preferredLanguage: partnerData.preferredLanguage,
                    preferredChatStyle: partnerData.preferredChatStyle,
                    location: {
                        country: partnerData.country,
                        state: partnerData.state,
                    },
                    isUserVerifiedByEmail: partnerData.isUserVerifiedByEmail
                }
            });
        };

        // Emit both directions
        emitMatch(partnerSocket, {
            id: socket.id,
            fullName: currentUserProfile.fullName,
            country: currentUserProfile.country,
            state: currentUserProfile.state,
            profileImage: currentUserProfile.profileImage,
            age: currentUserProfile.age,
            gender: currentUserProfile.gender,
            pronouns: currentUserProfile.pronouns,
            bio: currentUserProfile.shortBio,
            interests: currentUserProfile.interests,
            personalityType: currentUserProfile.personality,
            lookingFor: currentUserProfile.lookingFor,
            preferredLanguage: currentUserProfile.preferredLanguage,
            preferredChatStyle: currentUserProfile.chatStyles,
            isUserVerifiedByEmail: currentUser?.emailVerified || false
        });

        emitMatch(socket, {
            id: partnerSocket.id,
            fullName: partnerProfile.fullName,
            country: partnerProfile.country,
            state: partnerProfile.state,
            profileImage: partnerProfile.profileImage,
            age: partnerProfile.age,
            gender: partnerProfile.gender,
            pronouns: partnerProfile.pronouns,
            bio: partnerProfile.shortBio,
            interests: partnerProfile.interests,
            personalityType: partnerProfile.personality,
            lookingFor: partnerProfile.lookingFor,
            preferredLanguage: partnerProfile.preferredLanguage,
            preferredChatStyle: partnerProfile.chatStyles,
            isUserVerifiedByEmail: partnerUser?.emailVerified || false,
        });

        // Remove partner from queue
        waitingQueue.splice(i, 1);
        return;
    }

    // --- No match found, add this user to queue ---
    socket.userId = String(socket.userId);
    waitingQueue.push(socket);
    socket.emit('random:waiting');
}

module.exports = matchRandomUser;
