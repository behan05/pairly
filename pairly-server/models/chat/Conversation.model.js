
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
        mode: {
            type: String,
            enum: [
                'random',
                'private',
                'group',
                'anonymous',
                'invite',
                'topic',
                'nearby'
            ],
            default: 'random',
        },
        chatType: {
            type: String,
            enum: ['text', 'video', 'audio'],
            default: 'text',
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
