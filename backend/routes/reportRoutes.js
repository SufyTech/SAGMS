const express = require('express');
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');

const router = express.Router();

// Configure storage with absolute path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Using absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Enhanced multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      return cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false);
    }
    cb(null, true);
  }
});

// Submit report
// Before: single image
// router.post('/report', upload.single('image'), async (req, res) => {

// After: multiple images (max 3 for wet, dry, plastic)
router.post('/report', upload.array('images', 3), async (req, res) => {
  try {
    // Debugging logs
    console.log("Files received:", req.files);
    console.log("Body content:", req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const { location, description, wasteType, severity, suggestion } = req.body;

    const imageUrls = req.files.map(file => 
      file.path.replace(/\\/g, '/') // Convert paths for cross-platform
    );

    const newReport = new Report({
      imageUrls,
      location,
      description,
      wasteType,
      severity,
      suggestion,
    });

    await newReport.save();
    res.json({ message: 'Report submitted successfully!', data: newReport });
  } catch (err) {
    console.error("Error in report submission:", err);
    res.status(500).json({ 
      message: 'Failed to submit report',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

module.exports = router;