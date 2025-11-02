// controllers/postController.js
const Post = require("../models/post");
const User = require("../models/user"); // We might need this later

// Hien thi trang viet blog
function getNewPost(req, res) {
  res.render("pages/new-post", {
    pageTitle: "Create New Post",
  });
}

// Xu li tao bai viet
async function createPost(req, res) {
  try {
    const { title, content, category, tags } = req.body;

    // Get the logged-in user's ID from the session
    const authorId = req.session.userId;

    // Split tags string into an array (e.g., "js, node, mongo" -> ["js", "node", "mongo"])
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    const post = new Post({
      title: title,
      content: content,
      category: category,
      tags: tagsArray,
      author: authorId,
    });

    // Save the post to the database
    const savedPost = await post.save();

    // Redirect the user to the new post's page
    res.redirect(`/posts/${savedPost._id}`);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.redirect("/posts/new"); // Send them back to the form if there's an error
  }
}

// Hien thi post voi ID
async function getPost(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate({
      path: "author",
      select: "username profilePicture bio",
    });
    if (!post) {
      return res.json({messagge: "Error"});
    }
    res.json(post);
  } catch (err) {
    console.error("Get Post Error:", err);
    res.status(500).send("Server Error");
  }
}

// Hien thi toan bo bai viet (cho Homepage)
async function getAllPosts(req, res) {
  try {
    // Find all posts, sort by newest, and populate author's username
    const posts = await Post.find()
      .populate("author", "_id username")
      .sort({ createdAt: -1 }); // -1 means descending order
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
