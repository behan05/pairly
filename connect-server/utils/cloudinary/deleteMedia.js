const cloudinary = require('./cloudinary');

const deleteMediaFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;

    } catch (error) {
        console.error('Error deleting media from Cloudinary:', error.message);
    }
}

module.exports = deleteMediaFromCloudinary;