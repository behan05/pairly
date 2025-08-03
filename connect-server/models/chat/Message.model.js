
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        messageType: {
            type: String,
            default: 'text'
        },
        publicMediaId: {
            type: String,
            default: null
        },

        delivered: {
            type: Boolean,
            default: false
        },
        seen: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
