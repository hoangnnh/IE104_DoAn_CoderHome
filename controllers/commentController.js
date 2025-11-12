const Comment = require("../models/comment");
const User = require("../models/user");
const { Schema } = require("mongoose");

async function addComment(req, res) {
  try {
    const { postId, content } = req.body;
    const author = req.session.userId;
    const comment = await Comment.create({
      post: postId,
      content,
      author,
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error("Add Response Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getCommentByPostID(req, res) {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId })
      .populate("author", "_id username profilePicture")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getCommentByUserID(req, res) {
  try {
    const userId = req.params.id;
    const comments = await Comment.find({ author: userId })
      .populate({ path: "author", select: "_id username profilePicture" })
      .populate({ path: "post", select: "title" });
    res.json(comments);
    console.log("Get User Comments Success!", comments);
  } catch (err) {
    console.error("Get User Comments Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
}
module.exports = { addComment, getCommentByPostID, getCommentByUserID };
