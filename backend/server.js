import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from 'dotenv';
dotenv.config();


// Import the routes
import usersRoute from "./routes/users.js";
import handymenRoute from "./routes/handymen.js";
import dashboardRoute from "./routes/dashboard.js";
import reportRoute from "./routes/reports.js";
import feedbackRoute from "./routes/feedbacks.js";
import notificationRoute from "./routes/notifications.js";

const updateLastActive = require('./models/updateLastActive');
const authMiddleware = require('./models/authMiddleware'); // Ensure authentication first

// Apply the middleware to all authenticated routes
app.use(authMiddleware, updateLastActive);

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); // Provides secure default headers
app.use(json());

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
app.use("/api/notifications", notificationRoute);

// Port Configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
