/*
Field	=   Purpose
participants	= 	Array of exactly 2 users (1-on-1). We use ref: 'User' to link back to your main User model.
isRandomChat	=   Tells whether this was a random match or a saved (normal) conversation.
matchedAt       =   When the match or chat started. Used in history or analytics.
isActive		=   Whether the chat is currently live or ended (like disconnected, skipped, blocked, etc).
timestamps		=   Automatically adds createdAt and updatedAt. Helps in sorting chats by time.
*/

import mongoose from 'mongoose';

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

export default Conversation;
