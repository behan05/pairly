const mongoose = require('mongoose');

const loginActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    ip: String,
    agent: String,
    geo: {
        city: String,
        state: String,
        stateCode: String,
        country: String,
        countryCode: String,
        continent: String,
        continentCode: String,
        latitude: String,
        longitude: String,
    },

    loggedInAt: { type: Date, default: Date.now },
    success: { type: Boolean, default: true },
    reason: String // reason for failed login
}, { timestamps: true });

module.exports = mongoose.model('LoginActivity', loginActivitySchema);
