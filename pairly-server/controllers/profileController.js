const Profile = require('../models/Profile.model');
const User = require('../models/User.model');
// const deleteMediaFromCloudinary = require('../utils/cloudinary/deleteMedia');

exports.getMyProfileController = async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }

    try {
        // Try to find the profile
        let userProfile = await Profile.findOne({ user: userId }).lean();

        // If not found, create a default one
        if (!userProfile) {
            const user = await User.findById(userId).lean();

            // Create basic default profile
            const newProfile = await Profile.create({
                user: userId,
                fullName: user?.fullName || '',
                age: 18,
                gender: '',
                pronouns: '',
                shortBio: '',
                profileImage: '',
                lookingFor: '',
                preferredLanguage: '',
                country: '',
                state: '',
                city: '',
                matchScope: '',
                preferredAgeRange: { min: 18, max: 30 },
                personality: '',
                interests: [],
                chatStyles: [],
                strictInterestMatch: false,
            });

            userProfile = newProfile.toObject();
        }

        return res.status(200).json({
            success: true,
            profile: userProfile
        });

    } catch (error) {
        console.error('Error in getMyProfileController:', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while retrieving profile.',
            details: error.message
        });
    }
};

exports.updateGeneralInfoController = async (req, res) => {

    // get user id from request object
    const userId = req.user.id;

    // if no user id is found, send 401 Unauthorized response
    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }

    const {
        fullName,
        age,
        gender,
        pronouns,
        shortBio
    } = req.body;

    // validate required fields
    if (
        !fullName?.trim()
        || !gender?.trim()
        || !pronouns?.trim()
        || !shortBio?.trim()
    ) {
        return res.setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                success: false,
                error: 'All fields are required.'
            });
    }

    // validate age
    if (isNaN(age)) {
        return res.setHeader('Content-type', 'application/json')
            .status(400)
            .json({
                success: false,
                error: 'Age must be a number.'
            })
    };

    // validate age range
    if (age < 18 || age > 95) {
        return res.setHeader('Content-type', 'application/json')
            .status(400)
            .json({
                success: false,
                error: 'Age must be between 18 and 95.'
            })
    }

    // validate short bio
    if (shortBio.length > 200) {
        return res.setHeader('Content-type', 'application/json')
            .status(400)
            .json({
                success: false,
                error: 'Bio should be under 200 characters.'
            })
    }

    try {

        const updateProfile = {
            fullName,
            age,
            gender,
            pronouns,
            shortBio,
        }

        if (req.file && req.file.path) {

            // delete previous profile image
            const userProfile = await Profile.findOne({ user: userId });
            // if (userProfile.profileImagePublicId) {
                await deleteMediaFromCloudinary(userProfile.profileImagePublicId);
            // }

            // update new profile image
            updateProfile.profileImage = req.file.path;
            updateProfile.profileImagePublicId = req.file.filename;
        };

        // Find the profile by user ID and update it.
        const profile = await Profile.findOneAndUpdate({ user: userId }, updateProfile,
            { new: true, upsert: true });

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            profile: profile
        })

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({
            success: false,
            error: 'An error occurred while updating the profile.',
            details: error.message
        });
        return;
    }
};

exports.updateMatchingPreferencesController = async (req, res) => {
    const userId = req.user.id;
    // If no user ID is found, send 401 Unauthorized response
    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }
    // Destructure the required fields from the request body
    const {
        lookingFor,
        preferredLanguage,
        country,
        state,
        city,
        matchScope,
        preferredAgeRange = {}
    } = req.body;

    const { min, max } = preferredAgeRange;

    if (!lookingFor?.trim()
        || !preferredLanguage?.trim()
        || !country?.trim()
        || !state?.trim()
        || !city?.trim()
        || !matchScope?.trim()
    ) {
        res.setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                success: false,
                error: 'All fields are required.'
            });
        return;
    };

    if (isNaN(min) || isNaN(max)) {
        res.setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                success: false,
                error: 'Age range must be a number.'
            });
        return;
    }

    if (min < 18 || max > 95 || min >= max) {
        res.setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                success: false,
                error: 'Invalid age range.'
            });
        return;
    }

    try {
        const updatePreferences = {
            lookingFor,
            preferredLanguage,
            country,
            state,
            city,
            matchScope,
            preferredAgeRange: {
                min: parseInt(min),
                max: parseInt(max)
            }
        }

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            updatePreferences,
            { new: true, upsert: true }
        )

        res.setHeader('Content-Type', 'application/json')
            .status(200)
            .json({
                success: true,
                message: 'Matching preferences updated successfully.',
                profile: profile
            });

    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
            .status(500)
            .json({
                success: false,
                error: 'An error occurred while updating matching preferences.',
                details: error.message
            });
        return;
    }

};

exports.updateTagsAndInterestsController = async (req, res) => {

    const userId = req.user.id;

    // If no user ID is found, send 401 Unauthorized response
    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }

    const { interests, personality, chatStyles, strictInterestMatch } = req.body;
    if (
        !Array.isArray(interests) || !Array.isArray(chatStyles)
        || !personality
        || typeof strictInterestMatch !== 'boolean'
    ) {
        res.setHeader('Content-Type', 'application/json')
            .status(400)
            .json({
                success: false,
                error: 'All field are required.'
            });
        return;
    };

    try {
        const updateTagAndInterestController = await Profile.findOneAndUpdate(
            { user: userId },
            {
                interests,
                personality,
                chatStyles,
                strictInterestMatch
            },
            { new: true, upsert: true }
        )
        await updateTagAndInterestController.save();
        res.setHeader('Content-Type', 'application/json')
            .status(200)
            .json({
                success: true,
                message: 'tags and interests updated successfully.',
                profile: updateTagAndInterestController
            });

    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
            .status(500)
            .json({
                success: false,
                error: error.message || 'An error occurred while updating tags and interests.',
                details: error.message
            });
        return;
    }

};