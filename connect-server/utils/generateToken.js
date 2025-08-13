const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for the given user ID.
 *
 * @param {string} userId - The user's unique identifier.
 */

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
    )
}

module.exports = generateToken;