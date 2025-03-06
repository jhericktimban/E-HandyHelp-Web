const express = require("express");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

// ✅ Log an activity (POST)
router.post("/", async (req, res) => {
  try {
    const { username, action, description, timestamp } = req.body;

    const newLog = new ActivityLog({
      username,
      action,
      description,
      timestamp,
    });

    await newLog.save();
    res.status(201).json({ message: "Activity logged successfully" });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch all activity logs (GET)
router.get("/", async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }); // Sort by latest logs first
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; // Use CommonJS export
