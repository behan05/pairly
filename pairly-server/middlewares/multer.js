const multer = require('multer');
/*
    * Multer configuration for handling file uploads in the Pairly application.
    * This middleware is used to process incoming files for profile images, chat media (audio, video), and documents.
    * It validates file types and sizes before they are processed by the respective controllers.
    * Supported file types include:
    * - Images: JPEG, PNG, WEBP, GIF, JPG
    * - Audio: MP3, OGG, WAV, WEBM, AAC
    * - Video: MP4, WEBM, OGG, AVI, MPEG
    * - Documents: PDF, DOC, DOCX
 */

const allowedMimeTypes = [
    // Image formats
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg',

    // Audio formats
    'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm', 'audio/aac', 'audio/mp3',

    // video formats
    'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mpeg',

    // Document formats
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        // 10MB file size limit for all uploads (can be adjusted per route if needed)
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }

        else {
            cb(new Error('Unsupported file type'), false);
        }
    }
});

module.exports = upload;