const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // for user notification settings.
    newMatch: {
        type: Boolean,
        default: true
    },
    newMessage: {
        type: Boolean,
        default: true
    },
    warningAlerts: {
        type: Boolean,
        default: true
    },
    friendRequest: {
        type: Boolean,
        default: false
    },
    blockNotification: {
        type: Boolean,
        default: false
    },

    // for user privacy settings
    showProfilePic: {
        type: Boolean,
        default: true,
    },
    showLocation: {
        type: Boolean,
        default: true,
    },
    matchVerifiedOnly: {
        type: Boolean,
        default: false,
    },
    allowRechat: {
        type: Boolean,
        default: true,
    },
    blockNSFW: {
        type: Boolean,
        default: true,
    },
    autoDeleteChats: {
        type: Boolean,
        default: false,
    },
    allowExportData: {
        type: Boolean,
        default: false,
    },

    // for user chat settings
    messageSound: {
        type: Boolean,
        default: true
    },
    showTypingStatus: {
        type: Boolean,
        default: true
    },
    showOnlineStatus: {
        type: Boolean,
        default: true
    },
    chatTheme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark'
    },
    chatFontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
    },
    enterToSend: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);