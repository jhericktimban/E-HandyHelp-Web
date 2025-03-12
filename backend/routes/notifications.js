const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Handyman = require("../models/Handyman");

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or use your preferred email provider
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail or other email service
    pass: process.env.EMAIL_PASS, // App password or generated password for security
  },

  
});

// Send Warning Notification
router.post('/send-warning', async (req, res) => {
    const { handymanId, userId, reported_by } = req.body;

    const notificationContent =
      "Your account is subjected for suspension. Please email us your NTE to avoid account suspension.";

    let recipientEmail;

    // Identify if the recipient is a Handyman or User
    if (reported_by === "handyman") {
      const handyman = await Handyman.findById(handymanId);
      if (!handyman) return res.status(404).json({ message: "Handyman not found." });
      recipientEmail = handyman.email;
    } else {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });
      recipientEmail = user.email;
    }

    const newNotification = new Notification({
      handymanId,
      userId,
      notification_content: notificationContent,
      notif_for: reported_by === "handyman" ? "handyman" : "user",
      date_sent: new Date().toISOString(),
    });

    try {
        // Save the notification in the database
        await newNotification.save();

        // Send Email Notification
        transporter.sendMail({
            from: '"E-HandyHelp Team" <ehandyhelpteam@gmail.com>',
            to: recipientEmail,
            subject: "Warning: Account Suspension Notice",
            text: notificationContent,
        }, (error, info) => {
            if (error) {
                console.error("Nodemailer Error:", error);
            } else {
                console.log("Email Sent:", info.response);
            }
        });
          

        res.status(200).json({ message: 'Warning sent successfully.' });
    } catch (error) {
        console.error("Error sending warning:", error);
        res.status(500).json({ error: "Failed to send warning." });
    }
});

module.exports = router;
