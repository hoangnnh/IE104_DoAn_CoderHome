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
<<<<<<< HEAD
    default: "/images/samples/default-avt.png",
  },
  backgroundImg: {
    type: String,
    default: "/images/samples/default-bg.jpg",
=======
    default: "/images/samples/author-avt-2.jpg",
  },
  backgroundImg: {
    type: String,
    default: "/images/samples/user-bg.jpg",
>>>>>>> f9b60c8d45eb9c569296d5cd57d8546f4be3914e
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
