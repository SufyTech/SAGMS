const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  imageUrl: String,
  location: String,
  description: String,
  wasteType: String,
  severity: String,
  suggestion: String,
  status: {
    type: String,
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
