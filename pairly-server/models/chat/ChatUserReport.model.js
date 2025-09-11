const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        default: null,
        enum: ['harassment', 'spam', 'inappropriate-content', 'scam', 'other']
    },
    customReason: {
        type: String,
        default: null
    },
    isRandomChat: {
        type: Boolean,
        default: false
    },
    blockedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const ChatUserReport = mongoose.model('ChatUserReport', reportSchema);
module.exports = ChatUserReport;