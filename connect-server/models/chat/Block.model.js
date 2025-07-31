
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
