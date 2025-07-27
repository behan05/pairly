
function privateChatHandler(io, socket) {
    socket.on('private:join', ({ userId }) => {

    });

    socket.on('private:message', ({ toUserId, message }) => {

    });
};

module.exports = privateChatHandler;