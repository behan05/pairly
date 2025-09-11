const multer = require('multer');
const cloudinary = require('../utils/cloudinary/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Allowed formats (by extension)
const allowedFormats = [
    // Images
    'jpg', 'jpeg', 'png', 'webp', 'gif',
    // Videos
    'mp4', 'mov', 'webm', 'avi', 'mkv',
    // Audios
    'mp3', 'wav', 'ogg', 'm4a',
    // Documents
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt',
];

// Allowed mime types (for fileFilter)
const allowedMimeTypes = [
    // Images
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    // Videos
    'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska',
    // Audios
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
];

// Cloudinary Storage Engine
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        // Default to auto for mixed content
        let resourceType = 'auto';

        // Handle unsupported document types by setting resource_type: 'raw'
        if (
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.mimetype === 'application/vnd.ms-powerpoint' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'text/plain'
        ) {
            resourceType = 'raw';
        }

        return {
            folder: 'connect/random-chats',
            allowed_formats: allowedFormats,
            public_id: `user_${req.user?.id || 'guest'}_${Date.now()}`,
            resource_type: resourceType,
        };
    },
});

// Multer Upload Middleware
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
    limits: {
        // 500 MB in bytes
        fileSize: 500 * 1024 * 1024,
    },
});

module.exports = upload;
