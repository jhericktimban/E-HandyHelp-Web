const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Get all pending users
router.get('/pending', async (req, res) => {
  try {
    const users = await User.find({ accounts_status: 'pending' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all verified users
router.get('/verified', async (req, res) => {
  try {
    // Fetch users with verified account status
    const users = await User.find({ accounts_status: 'verified' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all rejected users
router.get('/rejected', async (req, res) => {
  try {
    // Fetch users with rejected account status
    const users = await User.find({ accounts_status: 'rejected' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all suspended users
router.get('/suspended', async (req, res) => {
  try {
    // Fetch users with suspended account status
    const users = await User.find({ accounts_status: 'suspended' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/suspend', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { accounts_status: 'suspended' }, 
      { new: true }
    );
    
    if (!updatedUser) {
      console.log(`User with ID ${userId} not found.`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User suspended successfully:`, updatedUser);
    res.json({ message: 'User suspended successfully' });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Verify user
router.put('/:id/verify', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { accounts_status: 'verified' }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject user
router.put('/:id/reject', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { accounts_status: 'rejected' }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a suspended user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Lift suspension route
router.put('/lift-suspension/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and update the accounts_status to 'verified'
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { accounts_status: 'verified' }, // Update the account status
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Suspension lifted successfully', user: updatedUser });
  } catch (error) {
    console.error('Error lifting suspension:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
