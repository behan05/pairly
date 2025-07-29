/*
You need fast read access to users looking for a match.
we don’t want to mutate our permanent Profile model every second.
It's short-lived — once a match is made, entry is deleted or marked isSearching: false.
*/

const mongoose = require('mongoose');

const matchQueueSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true // Ensures one user in queue at a time
        },
        isSearching: {
            type: Boolean,
            default: true // Marks if the user is actively looking
        },
        socketId: {
            type: String,
            required: true // For real-time matching with Socket.IO
        },
        joinedAt: {
            type: Date,
            default: Date.now // For optional FIFO or queue age filtering
        }
    },
    { timestamps: true }
);

const MatchQueue = mongoose.model('MatchQueue', matchQueueSchema);

module.exports =  MatchQueue;

