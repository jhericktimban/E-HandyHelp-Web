const User = require('../models/User');
const Handyman = require('../models/Handyman');

const updateLastActive = async (req, res, next) => {
    try {
        if (req.user) {
            await User.updateOne({ _id: req.user.id }, { lastActive: new Date() });
        }
        if (req.handyman) {
            await Handyman.updateOne({ _id: req.handyman.id }, { lastActive: new Date() });
        }
    } catch (error) {
        console.error('Error updating last active:', error);
    }
    next(); // Continue to the next middleware or route handler
};

module.exports = updateLastActive;
