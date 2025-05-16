const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  imageUrls: [String], // ← change from `imageUrl: String` to this
  location: String,
  description: String,
  wasteType: String,
  severity: String,
  suggestion: String,
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
