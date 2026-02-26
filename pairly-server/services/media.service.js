const cloudinary = require('../lib/cloudinary');

const {
    optimizeImageToWebp,
    optimizeVoiceToOgg,
    optimizeAudioToMp3,
    optimizeDocument
} = require('../utils/mediaProcessor.util');

async function uploadProfileImage(file) {
    try {
        if (!file || !file.buffer) {
            throw new Error('No image uploaded')
        }

        // 2MB limit check (before optimization)
        if (file.buffer.length > 2 * 1024 * 1024) {
            throw new Error('Image must be under 2MB')
        }

        // MIME type validation
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/jpg",
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Unsupported image type')
        }

        /// Optimize image -> convert to webp
        const optimizedBuffer = await optimizeImageToWebp(file.buffer);

        // Upload to Cloudinary
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'pairly/profile-images',
                    public_id: `user_${Date.now()}`,
                    resource_type: 'image',
                    format: 'webp'
                },
                (error, result) => {
                    if (error) {
                        return reject(error)
                    } else {
                        resolve(result)
                    }
                }
            );

            return stream.end(optimizedBuffer);
        })

    } catch (error) {
        throw error;
    }
};

async function uploadChatVoice(audioBuffer) {

};

module.exports = {
    uploadProfileImage,
    uploadChatVoice,
};