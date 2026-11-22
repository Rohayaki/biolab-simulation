require('dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const experimentRoutes = require('./routes/experimentRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Kết nối Mongoose
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biolab';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Gắn router (không có tiền tố /api)
app.use('/', experimentRoutes);

module.exports = app;
