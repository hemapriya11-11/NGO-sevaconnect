const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const NGO = require('../models/NGO');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'xxxxxx',
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, ngoId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    const ngo = await NGO.findById(ngoId);
    if (!ngo || ngo.status !== 'approved') {
      return res.status(400).json({ error: 'This NGO is not authorized to receive donations at this time.' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay accepts amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const donation = new Donation({
      userId: req.user._id,
      ngoId,
      amount,
      razorpay_order_id: order.id,
      status: 'pending',
    });

    await donation.save();

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'xxxxxx')
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      const donation = await Donation.findOneAndUpdate(
        { razorpay_order_id },
        {
          razorpay_payment_id,
          razorpay_signature,
          status: 'success',
        },
        { new: true }
      );

      if (!donation) {
          return res.status(404).json({ error: 'Donation order record not found' });
      }

      res.status(200).json({ message: 'Payment verified successfully', donation });
    } else {
      await Donation.findOneAndUpdate({ razorpay_order_id }, { status: 'failed' });
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment', details: error.message });
  }
};

exports.simulateDonation = async (req, res) => {
  try {
    const { amount, ngoId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    const ngo = await NGO.findById(ngoId);
    if (!ngo || ngo.status !== 'approved') {
      return res.status(400).json({ error: 'This NGO is not authorized to receive donations at this time.' });
    }

    const donation = new Donation({
      userId: req.user._id,
      ngoId,
      amount,
      razorpay_order_id: `fake_order_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      razorpay_payment_id: `fake_pay_${Date.now()}`,
      status: 'success',
    });

    await donation.save();

    res.status(201).json({ message: 'Simulated donation successful', donation });
  } catch (error) {
    console.error('Error simulating donation:', error);
    res.status(500).json({ error: 'Failed to process simulated donation' });
  }
};

exports.getReceivedDonations = async (req, res) => {
// ... existing getReceivedDonations ...
    try {
        const ngo = await NGO.findOne({ ownerId: req.user._id });
        if (!ngo) {
            return res.status(404).json({ error: 'NGO profile not found' });
        }

        const donations = await Donation.find({ ngoId: ngo._id, status: 'success' })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

        res.status(200).json({ donations, totalAmount });
    } catch (error) {
        console.error('Error fetching NGO donations:', error);
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
};
