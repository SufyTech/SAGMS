const express = require('express');
const Complaint = require('../models/Complaint');
const router = express.Router();

// Get all complaints (for admin panel)
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);  // Send complaints to the admin panel
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update complaint status (e.g., to 'Resolved')
router.put('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).send('Complaint not found');
    
    complaint.status = req.body.status;  // Update status
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
