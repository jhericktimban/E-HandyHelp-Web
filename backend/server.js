const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config(); // Load environment variables

// Import the routes
const usersRoute = require("./routes/users");
const handymenRoute = require("./routes/handymen");
const dashboardRoute = require("./routes/dashboard");
const reportRoute = require("./routes/reports");
const feedbackRoute = require("./routes/feedbacks");
const notificationRoute = require("./routes/notifications");

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); // Helmet automatically sets some security headers
app.use(express.json());

// Custom Headers for Security
app.use((req, res, next) => {
  // Content-Security-Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
  );

  // X-Frame-Options
  res.setHeader("X-Frame-Options", "DENY");

  // X-Content-Type-Options
  res.setHeader("X-Content-Type-Options", "nosniff");

  next();
});

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://my_database:6mAaP61jyT04DiFU@atlascluster.5hsvgm6.mongodb.net/e_handy_help?retryWrites=true&w=majority&appName=AtlasCluster",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/users", usersRoute);
app.use("/api/handymen", handymenRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/reports", reportRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/notifications", notificationRoute);

// Port Configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
