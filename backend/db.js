const mongoose = require('mongoose');

const connectDB = async () => {
  try {
   await mongoose.connect('mongodb+srv://smartapp_user:Satara_786@cluster0.qlek0b9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
