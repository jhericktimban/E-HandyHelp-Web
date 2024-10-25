const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Handyman = require('../models/Handyman');

router.get('/totals', async (req, res) => {
    try {
        const handymanTotal = await Handyman.countDocuments({accounts_status:'verified'});
        const usersTotal = await User.countDocuments({accounts_status:'verified'});
        const pendingHandymenTotal = await Handyman.countDocuments({ accounts_status: 'pending' });
        const pendingUsersTotal = await User.countDocuments({ accounts_status: 'pending' });
        const suspendedHandymenTotal = await Handyman.countDocuments({ accounts_status: 'suspended' });
        const suspendedUsersTotal = await User.countDocuments({ accounts_status: 'suspended' });

        res.json({
            handymanTotal,
            usersTotal,
            pendingHandymenTotal,
            pendingUsersTotal,
            suspendedHandymenTotal,
            suspendedUsersTotal,
        });
    } catch (error) {
        console.error('Error fetching totals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
