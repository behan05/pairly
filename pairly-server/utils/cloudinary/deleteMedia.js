const cloudinary = require('./cloudinary');

/**
 * Deletes a media file from Cloudinary using the provided public ID.
 * Tries across common resource types: image, video, and raw (e.g., audio, PDF).
 * 
 * @param {string} publicId - The public ID of the Cloudinary media to delete.
 * @returns {Promise<null|Error>} - Returns null if not found, or error if deletion fails.
 */

const deleteMediaFromCloudinary = async (publicId) => {
    const resourceType = ['image', 'video', 'raw'];

    for (let type of resourceType) {
        try {
            const result = await cloudinary.uploader.destroy(
                publicId,
                { resource_type: type }
            );

            if (result.result === 'ok') {
                return;
            } else if (result.result === 'not found') {
                continue;
            }

        } catch (err) {
            return err;
        }
    }

    return null;
};

module.exports = deleteMediaFromCloudinary;
