require('dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const Experiment = require('../models/Experiment');
const seedData = require('./experiments.seed.json');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biolab';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding.');

    // Xoá collection cũ
    await Experiment.deleteMany({});
    console.log('Cleared existing Experiments collection.');

    // Nạp dữ liệu từ file seed
    await Experiment.insertMany(seedData);
    console.log(`Successfully seeded ${seedData.length} experiments into 'Experiments' collection.`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
