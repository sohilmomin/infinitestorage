// Require Mongoose
const mongoose = require('mongoose');

// Define the schema for the user model
const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    //unique: true,
  },
  fileId: {
    type: Number,
    required: true,
    //unique: true,
  },
  fileType:{
    type:String,
  },
  fileSize:{
    type:String,
  }
},{timestamps:true});

// Create the User model based on the schema
const Files = mongoose.model('File', fileSchema);

// Export the User model
module.exports = Files;
