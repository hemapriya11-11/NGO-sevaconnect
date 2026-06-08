const express = require('express');
const router = express.Router();
const { registerUser, authUser, sendOTP, resetPassword } = require('../controllers/authController');

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/send-otp', sendOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
