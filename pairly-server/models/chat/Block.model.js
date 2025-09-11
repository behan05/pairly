const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema(
    {
        // The user who initiates the block
        blocker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // The user who is being blocked
        blocked: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // Predefined reason for blocking
        reason: {
            type: String,
            default: null
        },

        // Custom user-defined reason
        customReason: {
            type: String,
            default: null
        },

        // Indicates if this block occurred in a random chat session
        isRandomChat: {
            type: Boolean,
            default: false
        },

        // Timestamp of when the block occurred
        blockedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields automatically
    }
);

// Prevents duplicate block entries between the same two users
blockSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;
