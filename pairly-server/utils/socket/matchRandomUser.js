/**
 * Attempts to match a user with another random user in the waiting queue.
 * - Prevents duplicate matches or queue entries
 * - Emits match info to both users if a partner is found
 * - Falls back to waiting if no match is available
 * - Ensures default Settings document exists for each user
 */

async function matchRandomUser(socket, waitingQueue, activeMatches, Profile, io, Block, User, Settings) {
    // Prevent duplicate matching or multiple queue entries
    const isInQueue = waitingQueue.some(s => s.id === socket.id);

    if (activeMatches.has(socket.id) || isInQueue) {
        socket.emit('random:waiting');
        return;
    }

    // Fetch current user's profile and user document
    const currentUserProfile = await Profile.findOne({ user: socket.userId }).lean();
    const currentUser = await User.findById(socket.userId).lean();
    if (!currentUserProfile) return;

    // Ensure current user has Settings
    let currentUserSettings = await Settings.findOne({ user: socket.userId });
    if (!currentUserSettings) {
        currentUserSettings = new Settings({ user: socket.userId });
        await currentUserSettings.save();
    }

    // Try to find a partner in the waiting queue
    for (let index = 0; index < waitingQueue.length; index++) {
        const partnerSocket = waitingQueue[index];
        const partnerProfile = await Profile.findOne({ user: partnerSocket.userId }).lean();
        const partnerUser = await User.findById(partnerSocket.userId).lean();
        if (!partnerProfile || !partnerUser) continue;

        // Ensure partner also has Settings
        let partnerSettings = await Settings.findOne({ user: partnerSocket.userId });
        if (!partnerSettings) {
            partnerSettings = new Settings({ user: partnerSocket.userId });
            await partnerSettings.save();
        }

        // Check for block conditions
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

        // Save match info in activeMatches
        activeMatches.set(socket.id, partnerSocket.id);
        activeMatches.set(partnerSocket.id, socket.id);

        // Helper: emit match info
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

        // Emit match info to partnerSocket
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

        // Emit match info to current socket
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

        // Remove partner from queue after match
        waitingQueue.splice(index, 1);
        return;
    }

    // If no match found → add to waiting queue
    waitingQueue.push(socket);
    socket.emit('random:waiting');
}

module.exports = matchRandomUser;
