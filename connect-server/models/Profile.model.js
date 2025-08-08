const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    fullName: String,
    age: Number,
    pronouns: String,
    gender: String,
    shortBio: String,
    profileImage: String,
    profileImagePublicId: String,

    lookingFor: String,
    preferredLanguage: String,
    country: String,
    state: String,
    city: String,
    matchScope: String,

    preferredAgeRange: {
        min: Number,
        max: Number
    },

    strictInterestMatch: Boolean,
    personality: String,

    interests: {
        type: [String],
        default: []
    },

    chatStyles: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);

