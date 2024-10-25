const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // Adjust the path to your Handyman model
const axios = require('axios');
const Handyman = require('../models/Handyman');
const User = require('../models/User');

// Semaphore API credentials
const semaphoreApiKey = '6ce2d9ac9d5da878b0a9bb7b62aaddc5';
const semaphoreApiUrl = 'https://api.semaphore.co/api/v4/messages';

// Function to send SMS using Semaphore
const sendSms = async (contactNumber, message) => {
    try {
        const response = await axios.post(semaphoreApiUrl, {
            apikey: semaphoreApiKey,
            number: contactNumber,
            message: message,
            sendername: 'Thesis' // Customize the sender name if needed
        });
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};

router.post('/', async (req, res) => {
    try {
        const { handymanId, userId, notification_content, notif_for } = req.body;

        // Create the notification object
        const notification = new Notification({
            handymanId,
            userId,
            notification_content,
            notif_for,
            date_sent: new Date(),
        });

        // Send the SMS notification based on `notif_for`
        let contactNumber;
        let message = 'Your account has been subjected to suspension, it will be suspended in 3 days if you do not email us your NTE.';

        if (notif_for === 'handyman' && handymanId) {
            // Fetch the handyman's contact number
            const handyman = await Handyman.findById(handymanId);
            if (handyman && handyman.contact) {
                contactNumber = handyman.contact;
            } else {
                return res.status(400).json({ message: 'Handyman contact not found' });
            }
        } else if (notif_for === 'user' && userId) {
            // Fetch the user's contact number
            const user = await User.findById(userId);
            if (user && user.contact) {
                contactNumber = user.contact;
            } else {
                return res.status(400).json({ message: 'User contact not found' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid notif_for value or missing ID' });
        }

        // Send SMS if a valid contact number was found
        if (contactNumber) {
            await sendSms(contactNumber, message);
        }

        // Save the notification in the database
        await notification.save();

        res.status(201).json({ message: 'Notification and SMS sent successfully', notification });
    } catch (error) {
        console.error('Error details:', error);  // Log the full error details for debugging
        res.status(500).json({ message: 'Error sending notification', error });
    }
});

module.exports = router;
