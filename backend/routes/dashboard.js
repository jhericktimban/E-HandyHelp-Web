const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Handyman = require('../models/Handyman');

router.get('/totals', async (req, res) => {
    try {
        // Get current timestamp
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

        // Count totals for verified accounts
        const handymanTotal = await Handyman.countDocuments({ accounts_status: 'verified' });
        const usersTotal = await User.countDocuments({ accounts_status: 'verified' });

        // Count totals for pending accounts
        const pendingHandymenTotal = await Handyman.countDocuments({ accounts_status: 'pending' });
        const pendingUsersTotal = await User.countDocuments({ accounts_status: 'pending' });

        // Count totals for suspended accounts
        const suspendedHandymenTotal = await Handyman.countDocuments({ accounts_status: 'suspended' });
        const suspendedUsersTotal = await User.countDocuments({ accounts_status: 'suspended' });

        // Count real-time logged-in users (last activity within 5 minutes)
        const loggedInHandymanTotal = await Handyman.countDocuments({ lastActive: { $gte: fiveMinutesAgo } });
        const loggedInUsersTotal = await User.countDocuments({ lastActive: { $gte: fiveMinutesAgo } });

        // Send the response
        res.json({
            handymanTotal,
            usersTotal,
            pendingHandymenTotal,
            pendingUsersTotal,
            suspendedHandymenTotal,
            suspendedUsersTotal,
            loggedInHandymanTotal,
            loggedInUsersTotal,
        });
    } catch (error) {
        console.error('Error fetching totals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
