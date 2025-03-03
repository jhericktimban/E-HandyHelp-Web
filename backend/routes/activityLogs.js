const express = require("express");
const router = express.Router();
const ActivityLogs = require("../models/ActivityLog");


router.get("/", async (req, res) => {
  try {
    const logs = await ActivityLogs.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error });
  }
});


router.post("/", async (req, res) => {
  try {
    const { username, action, description } = req.body;
    const newLog = new ActivityLogs({ username, action, description });
    await newLog.save();
    res.status(201).json({ message: "Activity logged successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging activity", error });
  }
});

module.exports = router;
