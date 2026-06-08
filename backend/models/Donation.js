const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  ngoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'NGO', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: {
    type: String,
    default: 'INR'
  },
  razorpay_order_id: { 
    type: String, 
    required: true,
    unique: true
  },
  razorpay_payment_id: { 
    type: String, 
    default: '' 
  },
  razorpay_signature: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Donation', donationSchema);
