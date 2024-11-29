const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config(); // Load environment variables

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
