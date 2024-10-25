const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    handymanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Handyman', required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    notification_content: { type: String, required: true },
    notif_for: { type: String, enum: ['handyman', 'user'], required: true },
    date_sent: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
