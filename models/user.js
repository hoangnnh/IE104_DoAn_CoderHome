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
    default: "/images/samples/author-avt-2.jpg",
  },
  backgroundImg: {
    type: String,
    default: "/images/samples/user-bg.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
  likedPost: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    }
  ],
  readingHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: []
    }
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    }
  ],

  role: {
    type: String, 
    default: "User"
  },
  
  followingAuthors: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    }
  ],

    history: [
  {
    type: Schema.Types.ObjectId,
    ref: "Post",
    default: [],
  }
],
});

module.exports = mongoose.model("User", userSchema);
