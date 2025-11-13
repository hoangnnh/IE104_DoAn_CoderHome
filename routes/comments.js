const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const isAuth = require("../middleware/isAuth");

router.post("/", isAuth, commentController.addComment);
router.get("/u/:id", isAuth, commentController.getCommentByUserID);
router.get("/:id", isAuth, commentController.getCommentByPostID);
router.get("/user/:id", isAuth, commentController.getCommentByUserID);

module.exports = router;
