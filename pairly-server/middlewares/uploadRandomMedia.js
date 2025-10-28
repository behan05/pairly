// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = require('../utils/aws/s3Client');
// const path = require('path');

// // Allowed MIME types
// const allowedMimeTypes = [
//     // Images
//     'image/jpeg', 'image/png', 'image/webp', 'image/gif',
//     // Videos
//     'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska',
//     // Audios
//     'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a',
//     // Documents
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-powerpoint',
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'text/plain',
// ];

// const upload = multer({
//     storage: multerS3({
//         s3,
//         bucket: process.env.S3_BUCKET_NAME,
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         acl: 'private', // keep private for chats
//         key: (req, file, cb) => {
//             const ext = path.extname(file.originalname);
//             const folder = 'pairly/random-chats';
//             const fileName = `${folder}/user_${req.user?.id || 'guest'}_${Date.now()}${ext}`;
//             cb(null, fileName);
//         },
//     }),
//     fileFilter: (req, file, cb) => {
//         if (allowedMimeTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Unsupported file type'), false);
//         }
//     },
//     limits: {
//         fileSize: 300 * 1024 * 1024, // 300 MB
//     },
// });

// module.exports = upload;
