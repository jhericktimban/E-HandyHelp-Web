const express = require('express');
const router = express.Router();
const Handyman = require('../models/Handyman'); // Adjust the path to your Handyman model

// Get all pending handymen
router.get('/pending', async (req, res) => {
    try {
     const handymen = await Handyman.find({ accounts_status: 'pending' });
     res.json(handymen);
    } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });

  // Get all verified handymen
router.get('/verified', async (req, res) => {
    try {
      // Fetch handymen with verified account status
      const handymen = await Handyman.find({ accounts_status: 'verified' });
      res.json(handymen);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get all rejected handymen
  router.get('/rejected', async (req, res) => {
    try {
      // Fetch handymen with rejected account status
      const handymen = await Handyman.find({ accounts_status: 'rejected' });
      res.json(handymen);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get all suspended handymen
  router.get('/suspended', async (req, res) => {
    try {
      // Fetch users with suspended account status
      const handymen = await Handyman.find({ accounts_status: 'suspended' });
      res.json(handymen);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// Verify a handyman
router.put('/:id/verify', async (req, res) => {
  try {
    const handyman = await Handyman.findByIdAndUpdate(req.params.id, { accounts_status: 'verified' }, { new: true });
    res.json(handyman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject a handyman
router.put('/:id/reject', async (req, res) => {
  try {
    const handyman = await Handyman.findByIdAndUpdate(req.params.id, { accounts_status: 'rejected' }, { new: true });
    res.json(handyman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to suspend a handyman
router.put('/:id/suspend', async (req, res) => {
    try {
        const handymanId = req.params.id;
        await Handyman.findByIdAndUpdate(handymanId, { accounts_status: 'suspended' });
        res.json({ message: 'Handyman suspended successfully' });
    } catch (error) {
        console.error('Error suspending handyman:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// DELETE /api/handymen/:id
router.delete('/:id', async (req, res) => {
  try {
    const handymanId = req.params.id;
    await Handyman.findByIdAndDelete(handymanId);
    res.status(200).json({ message: 'Handyman deleted successfully' });
  } catch (error) {
    console.error('Error deleting handyman:', error);
    res.status(500).json({ message: 'Error deleting handyman' });
  }
});

router.put('/lift-suspension/:id', async (req, res) => {
  try {
    const handymanId = req.params.id;
    await Handyman.findByIdAndUpdate(handymanId, { accounts_status: req.body.accounts_status });
    res.status(200).send({ message: 'Suspension lifted successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error lifting suspension.' });
  }
});



module.exports = router;
