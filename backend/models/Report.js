const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
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
  reportReason: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now // Automatically set to the current date
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed'], // Possible statuses for the report
    default: 'pending'
  },
  additionalInfo: {
    workDescription: {
      type: String,
      required: true
    },
    dateReported: {
      type: Date,
      default: Date.now // Automatically set to the current date
    }
  }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
