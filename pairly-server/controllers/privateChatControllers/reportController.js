const ChatUserReport = require('../../models/chat/ChatUserReport.model');

/**
 * Post inappropriate message ducing chat.
 * 
 * @route POST /api/private-report/user
 * @param {import('express').Request} req - Express request object (contains authenticated user info).
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} - JSON response with the list of blocked users or error message.
 */

exports.reportUserChatController = async (req, res) => {
    const currentUserId = req.user.id;
    const { partnerUserId, reason, customReason } = req.body;

    // Check for authenticated user ID
    if (!currentUserId) {
        return res.status(401).json({
            error: "Unauthorized access: user ID is missing.",
            success: false
        });
    };

    // Prevent users from blocking themselves
    if (currentUserId === partnerUserId) {
        return res.status(400).json({
            error: 'You cannot report yourself.',
            success: false
        });
    }

    // Ensure reason is provided
    if (!reason) {
        return res.status(400).json({
            error: 'Report reason is required.',
            success: false
        });
    }


    const VALID_REPORT_REASONS = [
        'harassment', 'spam', 'inappropriate-content', 'scam', 'other'
    ];

    if (!VALID_REPORT_REASONS.includes(reason)) {
        return res.status(400).json({
            error: 'Invalid reason selected. Please select a valid option.',
            success: false
        });
    }

    // If 'other' is selected, ensure custom explanation is present
    if (reason === 'other') {
        if (!customReason || customReason.trim().length < 5) {
            return res.status(400).json({
                error: 'Please provide a meaningful explanation for selecting "Other".',
                success: false
            });
        }
    }

    try {
        // Save the report action in the database
        await ChatUserReport.create({
            reporterId: currentUserId,
            reportedUserId: partnerUserId,
            reason,
            customReason: reason === 'other' ? customReason.trim() : null,
            isRandomChat: false
        });

        return res.status(201).json({
            message: 'User has been reported successfully.',
            success: true
        });

    } catch (error) {
        // Handle other unexpected errors
        return res.status(500).json({
            error: 'An error occurred while trying to report the user.',
            details: error.message,
            success: false
        });
    }
};

