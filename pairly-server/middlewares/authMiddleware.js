const jwt = require('jsonwebtoken');

const authMiddleware = async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Unauthorized. Token missing.'
        });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.id || decoded._id };

        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Unauthorized. Invalid token.'
        });
    }
};

module.exports = authMiddleware;
