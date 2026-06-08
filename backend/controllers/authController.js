const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (email, otp) => {
  try {
    let transporter;
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.log('⚠️ No EMAIL_USER found in .env. Using Ethereal Email for testing...');
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || '"SevaConnect Support" <support@ethereal.email>',
      to: email,
      subject: 'SevaConnect Verification OTP',
      text: `Your OTP for verification is: ${otp}. It is valid for 5 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!process.env.EMAIL_USER) {
      console.log(`\n================================`);
      console.log(`✅ TEST OTP: ${otp}`);
      console.log(`✅ View Simulated Email: ${nodemailer.getTestMessageUrl(info)}`);
      console.log(`================================\n`);
    }

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, description, otp } = req.body;

    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed publicly' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      phone,
      description
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = generateOTP();
    
    await OTP.create({ email, otp });

    const emailSent = await sendEmail(email, otp);
    if (!emailSent && process.env.EMAIL_USER) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
