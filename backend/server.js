// Load environment variables first with explicit path
require("dotenv").config();

// Debugging: Check if MONGO_URI is loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const { connect } = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

// Import the routes (CommonJS requires `require`)
const usersRoute = require("./routes/users");
const handymenRoute = require("./routes/handymen");
const dashboardRoute = require("./routes/dashboard");
const reportRoute = require("./routes/reports");
const feedbackRoute = require("./routes/feedbacks");
const activityLogsRoute = require("./routes/activitylog");

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); // Provides secure default headers
app.use(express.json()); // Use `express.json()` instead of `{ json } from "express"`

// Custom security headers
app.use((req, res, next) => {
  // Content-Security-Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  // X-Frame-Options
  res.setHeader("X-Frame-Options", "DENY");

  // X-Content-Type-Options
  res.setHeader("X-Content-Type-Options", "nosniff");

  next();
});

// MongoDB connection
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/users", usersRoute);
app.use("/api/handymen", handymenRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/reports", reportRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/activityLogs", activityLogsRoute);

// Port Configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
