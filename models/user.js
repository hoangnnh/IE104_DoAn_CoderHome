// models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  bio: { // <-- New field
    type: String,
    default: '' 
  },
  profilePicture: {
    type: String,
    default: '/public/images/default-avatar.png' // You can set a default path
  }
});

module.exports = mongoose.model('User', userSchema);