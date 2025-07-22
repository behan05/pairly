const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');


// Create Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profileImage',
        
        // Allow only specific image formats for upload. ESLint may warn for long object literals or style issues.
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],  // eslint-disable-line

        // Generate a unique public ID for the uploaded file using the user ID and timestamp.
        // ESLint might warn about unused parameters or inline function style.
        public_id: (req, file) => {                       // eslint-disable-line
            return `user_${req.user.id}_${Date.now()}`;
        }
    }
});


// Correct place for fileFilter is here
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPG, JPEG, PNG, and WEBP files are allowed'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;
