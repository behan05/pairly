const Profile = require('../../models/Profile.model');
const PrivateChatRequest = require('../../models/chat/PrivateChatRequest.model');
const { getIO } = require('../../sockets/socketServer')

/**
 * Controller: getFriendRequestsController
 * -----------------------------------------
 * Retrieves a list of incoming private chat friend requests for the
 * currently authenticated user. Requests are filtered to include only
 * those with a status of "pending" or "cancelled" and are sorted by 
 * most recent first.
 *
 * Steps:
 *  1. Validates that the request contains a logged-in user ID.
 *  2. Queries PrivateChatRequest for requests sent to the current user.
 *  3. Collects sender user IDs and fetches their profile details.
 *  4. Maps request metadata with matching profile information.
 *  5. Returns a JSON response containing an array of pending requests.
 *
 * Response:
 *  - 200: Success with array of pending requests (possibly empty)
 *  - 401: Unauthorized (missing user ID)
 *  - 404: No pending requests found
 *  - 500: Server error during retrieval
 *
 * @async
 * @function getFriendRequestsController
 * @param {Object} req - Express request object (expects req.user.id)
 * @param {Object} res - Express response object
 * @returns {JSON} JSON response with friend request details
 * 
 * @throws {401} If the current user ID is missing (unauthorized).
 * @throws {404} If the partner is not connected or socket ID is invalid.
 * @throws {404} If no pending friend request is found for the given partner.
 * @throws {500} If an internal server error occurs.
 */
exports.getFriendRequestsController = async (req, res) => {
    const currentUserId = req.user.id;

    // Validate user authentication
    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: User ID is missing'
        });
    }

    try {
        // Fetch only requests sent to current user
        const pendingRequests = await PrivateChatRequest.find({
            to: currentUserId,
            status: { $in: ['pending', 'cancelled'] }
        }).sort({ createdAt: -1 }).lean();

        if (!pendingRequests.length) {
            return res.status(404).json({
                success: true,
                pendingRequests: []
            })
        };

        // Collect all 'from' IDs
        const fromUserId = pendingRequests.map(req => req.from);

        // Fetch all profiles
        const profiles = await Profile.find({ user: { $in: fromUserId } }).lean();

        // Map requests to profiles
        const pendingUserDetails = pendingRequests.map(request => {
            const pendingProfile = profiles.find(p => p.user.toString() === request.from.toString())
            if (!pendingProfile) return null;

            return {
                sender: request.from,
                fullName: pendingProfile?.fullName,
                profileImage: pendingProfile?.profileImage,
                gender: pendingProfile?.gender,
                bio: pendingProfile?.shortBio,
                status: request.status,
            };
        }).filter(Boolean);

        return res.status(200).json({
            success: true,
            pendingRequests: pendingUserDetails
        })
    } catch (error) {
        // Catch and handle any unexpected errors
        return res.status(500).json({
            error: 'An error occurred while retrieving pending user details.',
            details: error.message,
            success: false
        });
    }
};

/**
 * Accept a pending friend (private chat) request.
 * 
 * This controller:
 * - Validates that the current user is authenticated.
 * - Validates that the partner's socket is active and retrieves their user ID.
 * - Updates the friend request status from "pending" to "accepted" in the database.
 * 
 * @async
 * @function acceptFriendRequestController
 * @param {Object} req - Express request object.
 * @param {Object} req.user - The authenticated user's data (from middleware).
 * @param {string} req.user.id - The ID of the current authenticated user.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.partnerSocketId - The socket ID of the partner whose request is being accepted.
 * @param {Object} res - Express response object.
 * @returns {JSON} Success or error message.
 * 
 * @throws {401} If the current user ID is missing (unauthorized).
 * @throws {404} If the partner is not connected or socket ID is invalid.
 * @throws {404} If no pending friend request is found for the given partner.
 * @throws {500} If an internal server error occurs.
 */
exports.acceptFriendRequestController = async (req, res) => {
    const currentUserId = req.user.id;
    const { sender } = req.body;

    if (!currentUserId || !sender) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: User ID is missing'
        });
    }

    try {
        // Update request regardless of partner's connection status
        const friendRequest = await PrivateChatRequest.findOneAndUpdate(
            { from: sender, to: currentUserId, status: { $in: ['pending', 'cancelled'] } },
            { status: 'accepted' },
            { new: true }
        );

        if (!friendRequest) {
            return res.status(404).json({
                success: false,
                error: 'Friend request not found or already handled'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Friend request accepted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'An error occurred while accepting the friend request.',
            details: error.message
        });
    }
};

/**
 * Declines (rejects) a pending or cancelled friend request for the authenticated user.
 *
 * @async
 * @function declineFriendRequestController
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user object injected by auth middleware.
 * @param {string} req.user.id - ID of the currently authenticated user.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.partnerSocketId - Socket.IO ID of the user who sent the friend request.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response indicating success or failure.
 *
 * @description
 * This controller:
 * 1. Verifies the user is authenticated.
 * 2. Looks up the partner's socket using their `partnerSocketId`.
 * 3. Finds the friend request from the partner to the current user with a status of
 *    `'pending'` or `'cancelled'`.
 * 4. Updates its status to `'rejected'`.
 * 5. Responds with appropriate HTTP status codes and messages.
 *
 * @throws {401} If the user is not authenticated.
 * @throws {404} If the partner is not connected, the socket ID is invalid,
 *               or the friend request does not exist.
 * @throws {500} If an unexpected server error occurs.
 */
exports.declineFriendRequestController = async (req, res) => {
    const currentUserId = req.user.id;
    const { sender } = req.body;

    // Validate user authentication
    if (!currentUserId || !sender) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: User ID is missing'
        });
    }

    try {
        // Update friend request status
        const friendRequest = await PrivateChatRequest.findOneAndUpdate(
            { from: sender, to: currentUserId, status: { $in: ['pending', 'cancelled'] } },
            { status: 'rejected' },
            { new: true },
        );

        if (!friendRequest) {
            return res.status(404).json({
                success: false,
                error: 'Friend request not found or already handled'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Friend request rejected successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'An error occurred while declining the friend request.',
            details: error.message
        });
    }
};
