const jwt = require('jsonwebtoken');
const User = require('../../models/User.model');

/**
 * Verifies the provided JWT token and retrieves the associated user.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<Object|Error>} The user object without the password, or an error if verification fails.
 */

const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password').lean();
        return user;
    } catch (err) {
        return err;
    }
};

module.exports = verifyToken;
