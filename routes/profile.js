// routes/profile.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const isAuth = require("../middleware/isAuth"); // Import your auth guard

// -----------------------------------------------------------------
// NOTE: All routes here are prefixed with '/posts'
// (We will set this prefix in app.js)
// -----------------------------------------------------------------

// GET /posts/:id
// Show a single, specific post. This is public.
router.get("/:id", profileController.getUserProfile);

router.get("/", isAuth, profileController.getOwnProfile);

module.exports = router;
