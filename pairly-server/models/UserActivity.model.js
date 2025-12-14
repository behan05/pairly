const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    date: {
        type: String,
        required: true,
        index: true
    },   // yyyy-mm-dd

    // Daily summary
    firstActive: Date,
    lastSeen: Date,

    // Duration & Engagement
    durationMinutes: { type: Number, default: 0 },
    activeHours: [String],
    peakHour: String,

    // Device summary
    primaryDevice: String,
    deviceChanges: { type: Number, default: 0 },

    // Actions
    actionsCount: { type: Number, default: 0 },
    lastAction: String,
    actionTypes: { type: Map, of: Number, default: {} },
    avgResponseSec: Number,

    // Match Statistics
    matches: {
        total: { type: Number, default: 0 },

        text: { type: Number, default: 0 },
        audio: { type: Number, default: 0 },
        video: { type: Number, default: 0 },

        random: { type: Number, default: 0 },
        private: { type: Number, default: 0 },

        success: { type: Number, default: 0 },   // user continued conversation for > X seconds
        dropped: { type: Number, default: 0 }    // disconnected early
    },

    // Scores
    engagementScore: { type: Number, default: 0 },
    healthScore: { type: Number, default: 100 },

}, { timestamps: true });

userActivitySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("UserActivity", userActivitySchema);
