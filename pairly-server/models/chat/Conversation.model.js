
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            }
        ],
        isRandomChat: {
            type: Boolean,
            default: false
        },
        matchedAt: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
