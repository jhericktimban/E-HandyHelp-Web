const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: { 
    type: String, 
    required: true 
  },
  lname: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  },
  contact: { 
    type: String, 
    required: true 
  },
  images: { 
    type: String, 
    default: null 
  },
  dataPrivacyConsent: { 
    type: Boolean, 
    required: true 
  },
  accounts_status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'],  // Define allowed statuses
    default: 'pending'  // Default status set to 'pending'
  },
}, 
{ 
  timestamps: true  // Automatically manage createdAt and updatedAt timestamps
});

const User = mongoose.model('User', userSchema);

module.exports = User;
