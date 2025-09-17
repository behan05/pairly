const Block = require('../../models/chat/Block.model');
const Profile = require('../../models/Profile.model');

exports.getBlockedUsersController = async (req, res) => {
    const currentUserId = req.user.id;

    // Check for authenticated user ID
    if (!currentUserId) {
        return res.status(401).json({
            error: "Unauthorized access: user ID is missing.",
            success: false
        });
    }

    try {
        // Fetch all blocks where the current user is the blocker
        const blocksByUser = await Block.find({
            blocker: currentUserId,
        });

        // If user hasn't blocked anyone
        if (!blocksByUser.length) {
            return res.status(404).json({
                success: true,
                blockedUsers: [],
            });
        }

        // Get profile details of all blocked users
        const blockedUsersDetails = await Promise.all(
            blocksByUser.map(async (block) => {
                const blockedProfile = await Profile.findOne({ user: block.blocked });

                // If the blocked user's profile doesn't exist, skip
                if (!blockedProfile) return null;

                return {
                    blockedUserId: block.blocked,
                    profileImage: blockedProfile?.profileImage,
                    fullName: blockedProfile?.fullName,
                    blockedAt: block?.blockedAt?.toISOString(),
                    isRandomChat: block?.isRandomChat
                };
            })
        );

        // Filter out any null results (profiles not found)
        const filteredBlockedUsers = blockedUsersDetails.filter(Boolean);

        return res.status(200).json({
            blockedUsers: filteredBlockedUsers,
            success: true
        });

    } catch (error) {
        // Catch and handle any unexpected errors
        return res.status(500).json({
            error: 'An error occurred while retrieving blocked user details.',
            details: error.message,
            success: false
        });
    }
};