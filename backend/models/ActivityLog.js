const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Admin username
  action: { type: String, required: true }, // Action performed (e.g., "Login", "Update User")
  description: { type: String, required: true }, // Detailed description of action
  timestamp: { type: Date, default: Date.now }, // Timestamp of the action
});

const ActivityLogs = mongoose.model('ActivityLogs', activityLogSchema);

module.exports = mongoose.model(ActivityLogs);
