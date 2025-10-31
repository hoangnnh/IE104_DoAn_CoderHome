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

    // Find the post by its ID and populate the 'author' field
    // .populate('author', 'username') will find the user linked
    // to 'author' and only pull their 'username' field.
    const post = await Post.findById(postId).populate({
      path: "author",
      select: "username profilePicture bio",
    });

    if (!post) {
      return res.status(404).render("404", { pageTitle: "Post Not Found" });
    }

    res.render("pages/show-post", {
      pageTitle: post.title,
      post: post,
    });
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
      .populate("author", "username")
      .sort({ createdAt: -1 }); // -1 means descending order

    res.render("pages/index", {
      pageTitle: "Your Feed",
      posts: posts, // Pass the array of posts to the view
    });
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
