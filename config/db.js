const mongoose = require('mongoose');
const dotenv = require("dotenv");
const connectDB = async () => {
  try {
    await mongoose.connect(
        "mongodb://localhost:27017/voting-app",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );

    console.log('MongoDB is Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;