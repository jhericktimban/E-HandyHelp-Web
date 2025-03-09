const mongoose = require('mongoose');

// Define the Handyman Schema
const handymanSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensure unique usernames
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  specialization: {
    type: [String], // Array of strings
    required: true,
  },
  idImages: {
    type: [String], // Array of strings for image paths
    default: [],
  },
  certificatesImages: {
    type: [String], // Array of strings for certificate image paths
    default: [],
  },
  dataPrivacyConsent: {
    type: Boolean,
    default: false,
  },
  accounts_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'suspended'], // Possible statuses
    default: 'pending', // Default to pending
  },
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

// Create the Handyman Model
const Handyman = mongoose.model('Handyman', handymanSchema);

module.exports = Handyman;
