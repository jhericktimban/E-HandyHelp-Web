const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Handyman = require('../models/Handyman');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user = await User.findById(decoded.id);
        if (!user) {
            user = await Handyman.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user; // Attach user data to request
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
