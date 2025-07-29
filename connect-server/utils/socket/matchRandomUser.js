
async function matchRandomUser(socket, waitingQueue, activeMatches, Profile, io) {

    //Prevent duplicate matching or multiple queue entries
    const isInQueue = waitingQueue.some(s => s.id === socket.id);

    if (activeMatches.has(socket.id) || isInQueue) {
        // If already matched or in queue, just re-emit waiting status
        socket.emit('random:waiting');
        return;
    }

    // Get current user’s profile to use for matching
    const currentUserProfile = await Profile.findOne({ user: socket.userId });
    if (!currentUserProfile) return;

    // Iterate through waiting queue to find a match
    for (let index = 0; index < waitingQueue.length; index++) {
        const partnerSocket = waitingQueue[index];
        const partnerProfile = await Profile.findOne({ user: partnerSocket.userId });
        if (!partnerProfile) continue;

        // === MATCH FOUND Temp: IMMEDIATELY MATCH WITHOUT FILTERS ===

        // Save match info in activeMatches
        activeMatches.set(socket.id, partnerSocket.id);
        activeMatches.set(partnerSocket.id, socket.id);

        // Emit match info to both users
        const emitMatch = (toSocket, partnerData) => {
            toSocket.emit('random:matched', {
                partnerId: partnerData.id,
                partnerProfile: {
                    fullName: partnerData.fullName,
                    location: {
                        country: partnerData.country,
                        state: partnerData.state,
                    },
                    profileImage: partnerData.profileImage,
                }
            });
        };

        emitMatch(partnerSocket, {
            id: socket.id,
            fullName: currentUserProfile.fullName,
            country: currentUserProfile.country,
            state: currentUserProfile.state,
            profileImage: currentUserProfile.profileImage,
        });

        emitMatch(socket, {
            id: partnerSocket.id,
            fullName: partnerProfile.fullName,
            country: partnerProfile.country,
            state: partnerProfile.state,
            profileImage: partnerProfile.profileImage,
        });

        console.log(`Matched (No Filters): ${socket.id} <--> ${partnerSocket.id}`);

        // Remove matched partner from queue
        waitingQueue.splice(index, 1);
        return;
    }

    // If no match found, add current user to waiting queue
    waitingQueue.push(socket);
    socket.emit('random:waiting');
    console.log(`Waiting: ${socket.id}`);
}

module.exports = matchRandomUser;
