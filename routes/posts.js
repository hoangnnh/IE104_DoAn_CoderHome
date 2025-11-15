// routes/posts.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const isAuth = require("../middleware/isAuth"); // Import your auth guard

// -----------------------------------------------------------------
// NOTE: All routes here are prefixed with '/posts'
// (We will set this prefix in app.js)
// -----------------------------------------------------------------

router.get("/", isAuth, postController.getAllPosts);

// POST /posts
// Handle the creation of the new post. Must be logged in.
router.post("/", isAuth, postController.createPost);

// GET /posts/:id
// Show a single, specific post. This is public.
router.get("/:id", postController.getPost);

module.exports = router;
