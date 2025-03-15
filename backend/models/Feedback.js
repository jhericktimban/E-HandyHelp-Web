const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  handymanId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Handyman' // Reference to the Handyman model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  },
  feedbackText: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // Ensure the rating is between 1 and 5
  },
  timestamp: {
    type: Date,
    default: Date.now // Automatically set to the current date
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
