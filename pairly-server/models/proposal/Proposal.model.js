const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({

    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposalCategory: {
        type: String,
    },
    proposalMessage: {
        type: String,
        trim: true
    },
    proposalTheme: {
        type: String,
        trim: true
    },
    proposalBackground: {
        type: String,
        trim: true
    },
    proposalAnimationStyle: {
        type: String,
        trim: true
    },
    proposalGiftToken: {
        type: String,
        trim: true
    },
    proposalMusictype: {
        type: String,
        trim: true
    },
    proposalIntentionNote: {
        type: String,
        trim: true
    },
    proposalPrivateNote: {
        type: String,
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true })

module.exports = mongoose.model('Proposal', proposalSchema);