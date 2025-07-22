
const cloudinary = require('cloudinary').v2

cloudinary.config({
    // Load Cloudinary cloud name from environment variable (ESLint disabled for line formatting) 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // eslint-disable-line
    // Load API key from environment variable (ESLint disabled for line formatting) 
    api_key: process.env.CLOUDINARY_API_KEY,         // eslint-disable-line
    // Load API secret from environment variable (ESLint disabled for line formatting)
    api_secret: process.env.CLOUDINARY_API_SECRET    // eslint-disable-line
});

module.exports = cloudinary;