const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials from .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Export configured cloudinary instance for use in other files
module.exports = cloudinary;


