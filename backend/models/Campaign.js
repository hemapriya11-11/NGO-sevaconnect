const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
