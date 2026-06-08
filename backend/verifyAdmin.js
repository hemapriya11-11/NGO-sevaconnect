const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const verifyAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seva-connect-hub';
    await mongoose.connect(MONGODB_URI);

    const admins = await User.find({ role: 'admin' });
    console.log('--- ADMIN USERS IN DATABASE ---');
    admins.forEach(a => {
        console.log(`- Name: ${a.name} | Email: ${a.email} | Role: ${a.role}`);
    });
    
    if (admins.length === 0) {
        console.log('!!! NO ADMIN FOUND !!!');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyAdmin();
