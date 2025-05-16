const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },  // Image link if any
  status: { type: String, default: 'Pending' },  // E.g., Pending, In Progress, Resolved
  date: { type: Date, default: Date.now },
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
