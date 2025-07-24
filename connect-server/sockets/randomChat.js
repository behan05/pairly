
module.exports = (io, socket) => {
    
    socket.on('random:join', () => {
        // Add to match queue logic
    });

    socket.on('random:message', ({ message }) => {
        // Emit to paired user
    });

    socket.on('random:next', () => {
        // Disconnect current and search new
    });

    socket.on('random:end', () => {
        // End current chat and cleanup
    });
};
