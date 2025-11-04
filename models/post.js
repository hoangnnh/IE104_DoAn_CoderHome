// models/post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: false, // Không bắt buộc, có thể đặt giá trị mặc định
    default: '/images/default-thumbnail.png' // Một ảnh placeholder
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  tags: [String],

  likes: [{ // <-- An array of users who liked the post
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Post', postSchema);