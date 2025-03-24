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

// ✅ Delete selected activity logs (DELETE)
router.delete("/delete-logs", async (req, res) => {
  try {
      const { logIds } = req.body;

      if (!logIds || logIds.length === 0) {
          return res.status(400).json({ message: "No logs selected for deletion." });
      }

      await ActivityLog.deleteMany({ _id: { $in: logIds } });

      res.status(200).json({ message: "Selected logs deleted successfully." });
  } catch (error) {
      console.error("Error deleting logs:", error);
      res.status(500).json({ message: "Failed to delete logs." });
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
