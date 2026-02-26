const cloudinary = require('../lib/cloudinary');
const Profile = require('../models/Profile.model');

async function replaceProfileImage(userId) {
    if (!userId) return;

    try {
        const profile = await Profile.findOne({ user: userId });
        if (!profile || !profile.profileImagePublicId) return;

        // Delete the previous image from Cloudinary
        await cloudinary.uploader.destroy(profile.profileImagePublicId);

        // Remove the reference from DB
        profile.profileImage = null;
        profile.profileImagePublicId = null;
        profile.save();

    } catch (error) {
        console.error('Error replacing profile image:', error);
    }
};

module.exports = { replaceProfileImage }