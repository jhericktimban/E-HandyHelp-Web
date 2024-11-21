const express = require('express');
const Report = require('../models/Report'); // Adjust path as needed
const User = require('../models/User'); // User model
const Handyman = require('../models/Handyman'); // Handyman model
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('userId', 'fname lname') // Get the user's first and last name
            .populate('handymanId', 'fname lname'); // Get the handyman's first and last name

        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to update the report status
router.put('/:id', async (req, res) => {
    try {
        const reportId = req.params.id;
        const updatedReport = await Report.findByIdAndUpdate(reportId, { status: req.body.status }, { new: true });
        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
