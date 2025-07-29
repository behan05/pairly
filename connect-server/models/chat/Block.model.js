/*
blocker	= The user who initiated the block
blocked	= The user who is blocked
reason	= Optional reason for blocking (for future admin tools)
blockedAt	= Timestamp for auditing/block duration checks
timestamps	= Adds createdAt and updatedAt automatically
*/

const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema(
    {
        blocker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        blocked: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reason: {
            type: String,
            default: 'No reason provided'
        },
        blockedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

blockSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;
