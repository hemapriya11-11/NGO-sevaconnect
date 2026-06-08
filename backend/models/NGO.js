const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationCompleted: { type: Boolean, default: false },
  uploadedFiles: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String, default: '' },
  totalPeopleHelped: { type: Number, default: 0 },
  totalCampaigns: { type: Number, default: 0 },
}, {
  timestamps: true,
  strict: false, // allows dynamic fields
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('NGO', ngoSchema);
