const Profile = require('../models/Profile.model');
const Settings = require('../models/settings.model');
const MatchQueue = require('../models/chat/MatchQueue.model');
const Block = require('../models/chat/Block.model');

const waitingQueue = []; //  waiting queue
const activeMatches = new Map(); // socket.id => partner socket.id

function randomChatHandler(io, socket) {

    // === Join random chat ===
    socket.on('join-random', async () => {
        // Prevent duplicate matching or multiple queue entries
        if (activeMatches.has(socket.id) || waitingQueue.includes(socket)) return;

        const currentUserProfile = await Profile.findOne({ user: socket.userId });
        if (!currentUserProfile) return;

        for (let index = 0; index < waitingQueue.length; index++) {
            const partnerSocket = waitingQueue[index];
            const partnerProfile = await Profile.findOne({ user: partnerSocket.userId });
            if (!partnerProfile) continue;

            // === MATCH IMMEDIATELY (without conditions) ===
            activeMatches.set(socket.id, partnerSocket.id);
            activeMatches.set(partnerSocket.id, socket.id);

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
            waitingQueue.splice(index, 1); // remove matched partner from queue
            return;
        }

        // No one to match with, go to waiting queue
        waitingQueue.push(socket);
        socket.emit('random:waiting');
        console.log(`Waiting: ${socket.id}`);
    });

    // === Next chat ===
    socket.on('random:next', () => {
        const partnerId = activeMatches.get(socket.id);

        if (partnerId) {
            activeMatches.delete(socket.id);
            activeMatches.delete(partnerId);

            io.to(partnerId).emit('random:ended');
            socket.emit('random:ended');
        }

        // Look for new match
        if (waitingQueue.length > 0) {
            const partnerSocket = waitingQueue.shift();

            activeMatches.set(socket.id, partnerSocket.id);
            activeMatches.set(partnerSocket.id, socket.id);

            socket.emit('random:matched', { partnerId: partnerSocket.id });
            partnerSocket.emit('random:matched', { partnerId: socket.id });
        } else {
            waitingQueue.push(socket);
        }
    });

    // === Handle messaging ===
    socket.on('random:message', ({ message }) => {
        const partnerId = activeMatches.get(socket.id);

        if (!partnerId) {
            return socket.emit('random:error', { error: "You are not connected to anyone." });
        }

        io.to(partnerId).emit('random:message', {
            message,
            from: socket.id,
            timestamp: Date.now(),
        });
    });

    // === Disconnect ===
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Notify partner if matched
        const partnerId = activeMatches.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('random:partner-disconnected');
            }
            activeMatches.delete(partnerId);
        }
        activeMatches.delete(socket.id);

        // Remove from waitingQueue
        const index = waitingQueue.findIndex(s => s.id === socket.id);
        if (index !== -1) {
            waitingQueue.splice(index, 1);
            console.log(`Removed ${socket.id} from waitingQueue`);
        }
    });

}

module.exports = randomChatHandler;
