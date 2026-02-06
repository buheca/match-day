const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('⚠️ Running without MongoDB (for testing)');
  console.log('💡 Install MongoDB to enable database features');
};

module.exports = connectDB;