const cloudinary = require('../lib/cloudinary');
const {
    optimizeImageToWebp,
    optimizeVoiceOrMusicToOggAndMp3,
    optimizeVideoToMp4,
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

        // Optimize image -> convert to webp
        const optimizedBuffer = await optimizeImageToWebp(file.buffer, "profile");

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
    try {
        if (!audioBuffer || !audioBuffer.buffer) {
            throw new Error('No Audio file uploaded')
        }

        // 5MB limit check (before optimization)
        if (audioBuffer.buffer.length > 5 * 1024 * 1024) {
            throw new Error('Audio size must be upto 5MB')
        }

        // MIME type validation
        const allowedMimeTypes = [
            'audio/mpeg',
            'audio/ogg',
            'audio/wav',
            'audio/webm',
            'audio/aac',
            'audio/mp3'
        ]

        if (!allowedMimeTypes.includes(audioBuffer.mimetype)) {
            throw new Error('Unsupported audio type')
        }

        // Optimize audio -> convert to ogg format
        const optimizedBuffer = await optimizeVoiceOrMusicToOggAndMp3(audioBuffer.buffer, 'voice');

        // Upload to Cloudinary
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'pairly/chat-voice',
                    public_id: `user_${Date.now()}`,
                    resource_type: "video",
                    format: "ogg",
                    audio_codec: "opus",
                    bit_rate: "32k"
                },
                (error, result) => {
                    if (error) {
                        return reject(error)
                    } else {
                        return resolve(result)
                    }
                }
            )

            return stream.end(optimizedBuffer);
        })

    } catch (error) {
        throw error;
    }
};

async function uploadImage(file) {
    try {
        if (!file || !file.buffer) {
            throw new Error('No image uploaded');
        }

        // limit 10MB for chat images
        if (file.buffer.length > 10 * 1024 * 1024) {
            throw new Error('Image must be under 10MB');
        }

        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/jpg',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Unsupported image type');
        }

        // Optimize (to webp)
        const optimized = await optimizeImageToWebp(file.buffer, "chat");

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'pairly/chat-images',
                    public_id: `chat_${Date.now()}`,
                    resource_type: 'image',
                },
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
            stream.end(optimized);
        });
    } catch (err) {
        throw err;
    }
};

async function uploadAudio(file) {
    try {
        if (!file || !file.buffer) throw new Error('No audio uploaded');
        if (file.buffer.length > 20 * 1024 * 1024) {
            throw new Error('Audio size must be under 20MB');
        }
        const allowed = ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm', 'audio/aac', 'audio/mp3'];
        if (!allowed.includes(file.mimetype)) {
            throw new Error('Unsupported audio type');
        }
        // optional optimization
        const optimized = await optimizeVoiceOrMusicToOggAndMp3(file.buffer, "music");
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'pairly/chat-audio',
                    resource_type: 'auto',
                    public_id: `audio_${Date.now()}`,
                },
                (err, result) => (err ? reject(err) : resolve(result))
            );
            stream.end(optimized);
        });
    } catch (err) { throw err; }
};

async function uploadVideo(file) {
    try {
        if (!file || !file.buffer) throw new Error('No video uploaded');
        if (file.buffer.length > 50 * 1024 * 1024) {
            throw new Error('Video size must be under 50MB');
        }
        const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mpeg'];
        if (!allowed.includes(file.mimetype)) {
            throw new Error('Unsupported video type');
        }
        const optimized = await optimizeVideoToMp4(file.buffer);
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'pairly/chat-videos',
                    resource_type: 'video',
                    public_id: `video_${Date.now()}`,
                },
                (err, result) => (err ? reject(err) : resolve(result))
            );
            stream.end(optimized);
        });
    } catch (err) { throw err; }
};

async function uploadDocument(file) { };

module.exports = {
    uploadProfileImage,
    uploadChatVoice,
    uploadImage,
    uploadAudio,
    uploadVideo,
    uploadDocument
};