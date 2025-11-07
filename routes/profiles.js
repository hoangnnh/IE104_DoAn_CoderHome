// routes/profile.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const isAuth = require("../middleware/isAuth"); // Import your auth guard

// -----------------------------------------------------------------
// NOTE: All routes here are prefixed with '/profile'
// (We will set this prefix in app.js)
// -----------------------------------------------------------------

// GET /profile/:id
// Show a single, specific profile. This is public.
router.get("/:id", profileController.getUser);

router.get("/", isAuth, profileController.getUser);

module.exports = router;
