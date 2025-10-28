// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = require('../utils/aws/s3Client');
// const path = require('path');

// const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.S3_BUCKET_NAME,
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         acl: 'private', // keep private
//         key: (req, file, cb) => {
//             const ext = path.extname(file.originalname);
//             const fileName = `profile-images/user_${req.user.id}_${Date.now()}${ext}`;
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
//         fileSize: 5 * 1024 * 1024, // 5 MB
//     },
// });

// module.exports = upload;
