const mongoose = require('mongoose');

const BugReportSchema = new mongoose.Schema({
    issueType: {
        type: String,
        required: true,
        enum: [
            'bug', 'crash', 'ui-problem',
            'performance', 'chat-error',
            'matching-problem', 'other'
        ]
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    expectedBehavior: {
        type: String,
        default: ''
    },
    actualBehavior: {
        type: String,
        default: ''
    },
    deviceInfo: {
        type: String,
        default: ''
    },
    screenshot: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('BugReport', BugReportSchema);