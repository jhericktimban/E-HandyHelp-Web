const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); // Adjust the path if necessary
const Handyman = require('../models/Handyman');
const User = require('../models/User');

// GET all feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('handymanId', 'fname lname') // Populate handyman details
            .populate('userId', 'fname lname') // Populate user details
            .sort({ timestamp: -1 }); // Sort feedback by newest first
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
