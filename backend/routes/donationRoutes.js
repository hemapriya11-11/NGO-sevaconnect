const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, donationController.createOrder);
router.post('/verify', protect, donationController.verifyPayment);
router.post('/simulate', protect, donationController.simulateDonation);
router.get('/received', protect, donationController.getReceivedDonations);

module.exports = router;
