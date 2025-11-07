// controllers/postController.js
const Post = require("../models/post");
const User = require("../models/user");

function getNewPost(req, res) {
  res.render("pages/new-post", {
    pageTitle: "Create New Post",
  });
}

async function createPost(req, res) {
  try {
    const { title, description, thumbnailUrl, tags, content } = req.body;
    const authorId = req.session.userId;
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    const post = new Post({
      title: title,
      description: description,
      thumbnailUrl: thumbnailUrl || '/images/default-thumbnail.png',
      content: content,
      category: req.body.category || 'General',
      tags: tagsArray,
      author: authorId,
    });

    const savedPost = await post.save();

    res.redirect(`/posts/${savedPost._id}`);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.render("pages/new-post", {
      pageTitle: "Create New Post",
      error: "An error occured while creating the post. Please try again."
    });
  }
}

async function getPost(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate({
      path: "author",
      select: "username profilePicture bio",
    });
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    res.json(post);
  } catch (err) {
    console.error("Get Post Error:", err);
    res.status(500).send("Server Error");
  }
}

// Show all posts in Homepage
async function getAllPosts(req, res) {
  try {
    // Find all posts, sort by newest, and populate author's username
    const posts = await Post.find()
      .populate("author", "_id username profilePicture")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get All Posts Error:", err);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  getNewPost,
  createPost,
  getPost,
  getAllPosts,
};
