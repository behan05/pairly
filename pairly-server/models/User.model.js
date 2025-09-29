const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'facebook', 'github'],
        default: 'local',
    },

    lastSeen: {
        type: Date,
        default: null,
    },

    // Email verification fields
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailToken: { type: String }


}, { timestamps: true });

module.exports = mongoose.model('User', usersSchema);