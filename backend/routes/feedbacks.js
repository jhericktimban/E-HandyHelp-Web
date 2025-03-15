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

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Failed to delete feedback" });
    }
});



module.exports = router;
