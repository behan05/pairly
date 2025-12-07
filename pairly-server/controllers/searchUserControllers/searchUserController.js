const User = require('../../models/User.model');
const Profile = require('../../models/Profile.model');
const Block = require('../../models/chat/Block.model');

exports.fetchUserByPublicUserId = async (req, res) => {
    const currentUserId = req.user?.id;
    const { publicId } = req.params;

    // Auth check
    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized access. User must be logged in.',
        });
    }

    // Input validation
    if (!publicId) {
        return res.status(400).json({
            success: false,
            error: 'Public ID is required.',
        });
    }

    try {
        // Prevent self-search
        const user = await User.findById(currentUserId).lean();
        if (user?.publicId === publicId) {
            return res.status(400).json({
                success: false,
                error: 'You cannot search for yourself.',
            });
        }

        // Check if blocked
        const isBlocked = await Block.findOne({
            $or: [
                { blocker: currentUserId, blocked: user?._id },
                { blocker: user?._id, blocked: currentUserId },
            ],
        }).lean();

        if (isBlocked) {
            return res.status(403).json({
                success: false,
                error: 'You cannot view this user.',
            });
        }

        // Search user by publicId
        const searchResult = await User.findOne({ publicId });

        if (!searchResult) {
            return res.status(404).json({
                success: false,
                error: 'The Public ID you entered does not match any user.',
            });
        }

        const searchUserProfile = await Profile.findById(searchResult._id);
        const payload = {
            searchUserId: searchResult._id,
            fullName: searchResult?.fullName,
            publicId: searchResult?.publicId,
            profileImage: searchUserProfile?.profileImage
        }

        // Return result
        return res.status(200).json({
            success: true,
            user: payload,
        });
    } catch (error) {
        console.error('Error fetching user by publicId:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error.',
        });
    }
};
