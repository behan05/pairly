const Block = require('../../models/chat/Block.model');
/**
 * @fileoverview This module imports the `getIO` function, which returns the active Socket.IO server instance.
 * 
*/

/**
 * @desc Block a user by their socket ID
 * @route POST /api/block/user
 * @access Private (Authenticated users only)
 *
 * @param {string} req.body.blockPartnerId - The socket ID of the user to block
 * @param {string} req.body.reason - Predefined reason for blocking
 * @param {string} [req.body.customReason] - Optional explanation if reason is 'other'
 *
 * @returns {Object} JSON response with success or error message
 */
exports.blockUserControllerById = async (req, res) => {
    const currentUserId = req.user.id;

    // Checking user validation
    if (!currentUserId) {
        return res.status(401).json({
            error: "Unauthorized access: user ID is missing.",
            success: false
        });
    }

    const { partnerUserId, reason, customReason } = req.body;

    // Prevent users from blocking themselves
    if (currentUserId === partnerUserId) {
        return res.status(400).json({
            error: 'You cannot block yourself.',
            success: false
        });
    }

    // Ensure reason is provided
    if (!reason) {
        return res.status(400).json({
            error: 'Blocking reason is required.',
            success: false
        });
    }

    // Allowed block reasons
    const VALID_BLOCK_REASONS = [
        "inappropriate_messages",
        "spam_or_advertising",
        "harassment_or_bullying",
        "offensive_content",
        "fake_profile",
        "unwanted_contact",
        "scam_or_fraud",
        "privacy_concerns",
        "hate_speech_or_threats",
        "other"
    ];

    // Validate reason value
    if (!VALID_BLOCK_REASONS.includes(reason)) {
        return res.status(400).json({
            error: 'Invalid reason selected. Please select a valid option.',
            success: false
        });
    }

    // If 'other' is selected, ensure custom explanation is present
    if (reason === 'other') {
        if (!customReason || customReason.trim().length < 10) {
            return res.status(400).json({
                error: 'Please provide a meaningful explanation for selecting "Other".',
                success: false
            });
        }
    }

    try {
        // Save the block action in the database
        await Block.create({
            blocker: currentUserId,
            blocked: partnerUserId,
            reason,
            customReason: reason === 'other' ? customReason.trim() : null,
            isRandomChat: false
        });

        return res.status(201).json({
            message: 'User has been blocked successfully.',
            success: true
        });

    } catch (error) {
        // Handle duplicate block (already blocked)
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'This user has already been blocked.',
                success: false
            });
        }

        // Handle other unexpected errors
        return res.status(500).json({
            error: 'An error occurred while trying to block the user.',
            details: error.message,
            success: false
        });
    }
};

/**
 * @route   Delete /api/block/user
 * @desc    Unblock a user by their socket ID
 * @access  Private
 * 
 * @param {Object} req - Express request object (expects authenticated user and blockedPartnerId in body)
 * @param {Object} res - Express response object
 * @returns {JSON} - Success or error message
 */
exports.unblockUserControllerById = async (req, res) => {
    const currentUserId = req.user.id;
    const { blockedUserId } = req.body;

    // Check for authenticated user ID
    if (!currentUserId) {
        return res.status(401).json({
            error: "Unauthorized access: user ID is missing.",
            success: false
        });
    };

    try {
        // Check if block entry exists between current user and partner
        const blockedUser = await Block.findOne({
            blocker: currentUserId,
            blocked: blockedUserId,
            isRandomChat: false
        });

        if (!blockedUser) {
            return res.status(404).json({
                message: "No block entry found for this user.",
                success: false
            });
        };

        // Delete the block record from DB
        await Block.findOneAndDelete({
            blocker: currentUserId,
            blocked: blockedUserId,
            isRandomChat: false
        });

        // Respond with success
        return res.status(200).json({
            message: "User has been unblocked successfully.",
            success: true
        });

    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({
            error: "An error occurred while unblocking the user.",
            details: error.message,
            success: false
        });
    }
};
