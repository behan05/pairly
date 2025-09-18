const mongoose = require('mongoose');

const chatClearLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    clearTimestamp: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatClearLog', chatClearLogSchema);