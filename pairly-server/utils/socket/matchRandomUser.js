/**
 * Attempts to match a user with another random user in the waiting queue.
 * - Prevents duplicate matches or queue entries
 * - Emits match info to both users if a partner is found
 * - Falls back to waiting if no match is available
 * 
 * @param {Object} socket - The current user socket
 * @param {Array} waitingQueue - List of user waiting to matched
 * @param {Map} activeMatches - Map of active socket ID pair
 * @param {Model} Profile - Mongoose model for user profile
 * @param {Object} io - Socket.io server instance
*/

async function matchRandomUser(socket, waitingQueue, activeMatches, Profile, io, Block, User) {

    //Prevent duplicate matching or multiple queue entries
    const isInQueue = waitingQueue.some(s => s.id === socket.id);

    // If already matched or in queue, just re-emit waiting status
    if (activeMatches.has(socket.id) || isInQueue) {
        socket.emit('random:waiting');
        return;
    }

    // Get current user’s profile to use for matching
    const currentUserProfile = await Profile.findOne({ user: socket.userId });
    const currentEmailVarified = await User.findOne({ _id: socket.userId });
    if (!currentUserProfile) return;
    console.log('Curent: ' + currentEmailVarified);

    // Iterate through waiting queue to find a match
    for (let index = 0; index < waitingQueue.length; index++) {
        const partnerSocket = waitingQueue[index];
        const partnerProfile = await Profile.findOne({ user: partnerSocket.userId });
        const partnerEmailVarified = await Profile.findOne({ _id: partnerSocket.userId });
        if (!partnerProfile || partnerEmailVarified) continue;

        // === MATCH FOUND TEMP: IMMEDIATELY MATCH WITHOUT FILTERS DUE TO SOME USERS===

        // Check Block conditions.
        const blockUsers = await Block.findOne({
            $or: [
                { blocker: socket.userId, blocked: partnerSocket.userId },
                { blocker: partnerSocket.userId, blocked: socket.userId }
            ]
        });

        if (blockUsers) {
            waitingQueue.push(socket);
            return;
        }

        // Save match info in activeMatches
        activeMatches.set(socket.id, partnerSocket.id);
        activeMatches.set(partnerSocket.id, socket.id);

        // Emit match info to both users
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

        // Emit match info to partnerSocket sockets
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
            isUserVerifiedByEmail: currentEmailVarified?.emailVerified || false
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
            isUserVerifiedByEmail: partnerEmailVarified?.emailVerified || false,
        });

        // Remove matched partner from queue
        waitingQueue.splice(index, 1);
        return;
    }

    // If no match found, add current user to waiting queue
    waitingQueue.push(socket);
    socket.emit('random:waiting');
}

module.exports = matchRandomUser;
