const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seva-connect-hub';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = 'sevaconnect11@gmail.com';
    const adminPassword = 'Sevaconnect@11';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists. Updating password and permissions...');
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      existingAdmin.isBlocked = false;
      await existingAdmin.save();
      console.log('Admin updated successfully.');
    } else {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isBlocked: false
      });
      console.log('Admin created successfully.');
    }

    mongoose.disconnect();
    console.log('Seed completed.');
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
