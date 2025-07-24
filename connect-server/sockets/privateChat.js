
module.exports = (io, socket) => {
    socket.on('private:join', ({ userId }) => {
        
    });

    socket.on('private:message', ({ toUserId, message }) => {
        const room = `room:${toUserId}`;
        
    });
};
