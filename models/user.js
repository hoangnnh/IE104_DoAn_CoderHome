// models/user.js
const mongoose = require("mongoose");
const post = require("./post");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "/images/user-avatar.jpg",
  },
  backgroundImg: {
    type: String,
    default: "/images/user-bg.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postedPost: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  liked: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
  contributors: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],

  role: {
    type: String, 
    default: "User"
  }
  
});

module.exports = mongoose.model("User", userSchema);
