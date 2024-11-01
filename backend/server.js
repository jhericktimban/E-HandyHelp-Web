const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRoute = require("./routes/users");
const handymenRoute = require("./routes/handymen");
const dashboardRoute = require("./routes/dashboard");
const reportRoute = require("./routes/reports");
const feedbackRoute = require("./routes/feedbacks");
const notificationRoute = require("./routes/notifications");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://my_database:6mAaP61jyT04DiFU@atlascluster.5hsvgm6.mongodb.net/e_handy_help?retryWrites=true&w=majority&appName=AtlasCluster",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/users", usersRoute); // Route for users
app.use("/api/handymen", handymenRoute); // Route for handymen
app.use("/api/dashboard", dashboardRoute); // Route for Dashboard
app.use("/api/reports", reportRoute); // Route for Report
app.use("/api/feedback", feedbackRoute); // Route for feedback
app.use("/api/notifications", notificationRoute); // Route for notifications

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
