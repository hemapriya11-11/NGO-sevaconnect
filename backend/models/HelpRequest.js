const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  requestDetails: { 
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: { 
    type: String, 
    enum: ['submitted', 'verification_pending', 'under_review', 'approved', 'rejected', 'completed'], 
    default: 'submitted' 
  },
  eligibilityStatus: { 
    type: String, 
    enum: ['pending', 'eligible', 'not_eligible'], 
    default: 'pending' 
  },
  notes: { type: String, default: '' },
  internalNotes: { type: String, default: '' },
  isSuspicious: { type: Boolean, default: false },
  supportingFiles: [{ type: String }],
  phone: { type: String }, // Contact for NGO to call
  email: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
