const mongoose = require('mongoose');

const privateChatRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'cancelled'],
        default: 'pending'
    },
    deleteAt: {
        type: Date,
        default: null
    },
}, { timestamps: true });

// Ensure only one request exists between the same two users in any direction
privateChatRequestSchema.index(
    { from: 1, to: 1 },
    { unique: true }
);

module.exports = mongoose.model('PrivateChatRequest', privateChatRequestSchema);
