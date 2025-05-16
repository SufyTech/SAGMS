const express = require('express');
const multer = require('multer');
const path = require('path');
const WasteReport = require('../models/WasteReport');

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST /upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const fakeResult = "Garbage detected"; // Placeholder for ML result
    const imagePath = `/uploads/${req.file.filename}`;

    const newReport = new WasteReport({
      imagePath,
      result: fakeResult,
    });

    await newReport.save();

    res.status(200).json({ message: 'Report uploaded successfully', result: fakeResult });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
