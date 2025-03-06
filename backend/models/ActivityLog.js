const mongoose = require("mongoose");

const activityLogsSchema = new mongoose.Schema({
  username: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const ActivityLog = mongoose.model('ActivityLog', activityLogsSchema);

module.exports = ActivityLog;
