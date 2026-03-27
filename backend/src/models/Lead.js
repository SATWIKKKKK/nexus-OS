const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'New',
  },
  value: {
    type: String,
    default: '',
  },
  source: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lead', leadSchema);
