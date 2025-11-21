// controllers/postController.js
const Post = require("../models/post");
const User = require("../models/user");

const markdownit = require("markdown-it");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDomPurify(window);

async function createPost(req, res) {
  const md = markdownit({
    html: false,
    breaks: true,
    linkify: true,
  });

  try {
    const { title, description, thumbnailUrl, tags, content } = req.body;
    const authorId = req.session.userId;
    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    let cleanHTML = "";
    if (content) {
      const rawHTML = md.render(content);
      cleanHTML = DOMPurify.sanitize(rawHTML);
    }

    const post = new Post({
      title: title,
      description: description,
      thumbnailUrl: thumbnailUrl || "/images/samples/default-thumbnail.png",
      contentHTML: cleanHTML,
      category: req.body.category || "General",
      tags: tagsArray,
      author: authorId,
    });

    const savedPost = await post.save();

    // await User.findByIdAndUpdate(req.user._id, {
    //   $push: { postedPosts: post._id } // use $push/$addToSet per your intended behavior
    // });

    const userId =
      (req.user && req.user._id) || (req.session && req.session.userId) || null;
    if (!userId) {
      console.error(
        "createPost: No authenticated user found (req.user missing). Post created but not linked to any user:",
        post._id
      );
    } else {
      // Use $addToSet to avoid duplicate entries; use $push if you explicitly want duplicates
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { postedPosts: post._id } },
        { new: true, select: "_id postedPosts" }
      );
      if (!updatedUser) {
        console.error(
          "createPost: Failed to update user postedPosts for userId:",
          userId
        );
      } else {
        console.log(
          "createPost: User postedPosts updated. userId:",
          userId,
          "newCount:",
          updatedUser.postedPosts.length
        );
      }
    }

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
  createPost,
  getPost,
  getAllPosts,
  getStats,
};
