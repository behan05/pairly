/*
Field	=   Purpose
conversation	=   Reference to the Conversation this message belongs to
sender	=   The user who sent this message
content	=   The message content (text, image URL, etc.)
messageType	=   Useful later if you support images, videos, files
delivered & seen	=   For future enhancements like message status (WhatsApp-style)
timestamps	=   Adds createdAt (useful for chat logs/sorting)
*/

import mongoose from 'mongoose';

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
            enum: ['text', 'image', 'video', 'file'],
            default: 'text'
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

export default Message;
