const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for the given user ID.
 *
 * @param {string} userId - The user's unique identifier.
 * @returns {string} A signed JWT token valid for 7 hours.
 */

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: `7h` }
    )
}

module.exports = generateToken;