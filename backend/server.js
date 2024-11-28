const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config(); // Import dotenv for environment variables

const usersRoute = require("./routes/users");
const handymenRoute = require("./routes/handymen");
const dashboardRoute = require("./routes/dashboard");
const reportRoute = require("./routes/reports");
const feedbackRoute = require("./routes/feedbacks");
const notificationRoute = require("./routes/notifications");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
