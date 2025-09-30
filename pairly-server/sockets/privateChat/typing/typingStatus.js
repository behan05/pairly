
function typingHandler(socket, io) {
    socket.on('privateChat:typing', ({ from, to }) => {
        if (!to) return;
        const roomId = [from, to].sort().join('-');
        io.to(roomId).emit('privateChat:partner-typing', { from, to });
    });

    socket.on('privateChat:stop-typing', ({ from, to }) => {
        if (!to) return;
        const roomId = [from, to].sort().join('-');
        io.to(roomId).emit('privateChat:partner-stopTyping', { from, to });
    });
}

module.exports = typingHandler;