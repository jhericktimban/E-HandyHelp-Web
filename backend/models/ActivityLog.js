const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema); // Use CommonJS export
