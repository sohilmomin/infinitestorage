// Require Mongoose
const mongoose = require('mongoose');

// Define the schema for the user model
const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    //unique: true,
  },
  filenameAtTelegram: {
    type: String,
    required: true,
    //unique: true,
  },
  fileType:{
    type:String,
  }
});

// Create the User model based on the schema
const Files = mongoose.model('File', fileSchema);

// Export the User model
module.exports = Files;
