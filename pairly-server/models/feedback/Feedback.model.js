const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    type: { type: String, enum: ['onboarding', 'feature', 'session', 'suggestion'], required: true },
    rating: { type: String },
    message: { type: String },
    priority: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports =  mongoose.model('Feedback', feedbackSchema);
