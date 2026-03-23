const jwt = require('jsonwebtoken');
const config = require('../config/env');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
        if (token) console.warn(`[AUTH] Placeholder token "${token}" for ${req.method} ${req.url}`);
        else console.warn(`[AUTH] Missing token for ${req.method} ${req.url}`);

        return res.status(401).json({
            success: false,
            error: 'Access denied. No valid token provided.'
        });
    }

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(`[AUTH] Token verification failed for ${req.method} ${req.url}:`, err.message);
            console.debug(`[AUTH] Token used: ${token.substring(0, 15)}...`);
            console.debug(`[AUTH] Secret defined: ${!!config.JWT_SECRET}`);
            return res.status(403).json({
                success: false,
                error: 'Invalid or expired token.'
            });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
