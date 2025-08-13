
function typingHandler(io, socket, activeMatches) {
    // === Typing indicator: started ===
    socket.on('random:typing', () => {
        const partnerId = activeMatches.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            partnerSocket?.emit('random:partner-typing', true);
        }
    });

    // === Typing indicator: stopped ===
    socket.on('random:stop-typing', () => {
        const partnerId = activeMatches.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            partnerSocket?.emit('random:partner-typing', false);
        }
    });
}

module.exports = typingHandler;