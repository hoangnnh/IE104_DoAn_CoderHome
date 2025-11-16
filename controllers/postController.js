// controllers/postController.js
const Post = require("../models/post");
const User = require("../models/user");

const { marked } = require('marked')
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDomPurify(window);

function getNewPost(req, res) {
  res.render("pages/new-post", {
    pageTitle: "Create New Post",
  });
}

async function createPost(req, res) {
  try {
    const { title, description, thumbnailUrl, tags, content } = req.body;
    const authorId = req.session.userId;
    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    let cleanHTML = '';
    if (content) {
      const rawHTML = marked.parse(content);
      cleanHTML = DOMPurify.sanitize(rawHTML);
    }

    const post = new Post({
      title: title,
      description: description,
      thumbnailUrl: thumbnailUrl || "/images/default-thumbnail.png",
      contentHTML: cleanHTML,
      category: req.body.category || "General",
      tags: tagsArray,
      author: authorId,
    });

    const savedPost = await post.save();

    res.redirect(`/post/${savedPost._id}`);
  } catch (err) {
    console.error("Create Post Error:", err);
  }
}

async function getPost(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate({
      path: "author",
      select: "_id username profilePicture bio",
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

async function getStats(req, res) {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getNewPost,
  createPost,
  getPost,
  getAllPosts,
  getStats,
};
