const jwt = require('jsonwebtoken');
const User = require('../../models/User.model');

const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password').lean();
        return user;
    } catch (err) {
        return null;
    }
};

module.exports = verifyToken;
