// routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const isAuth = require('../middleware/isAuth');

router.get('/new', isAuth, postController.getNewPost);

router.get("/", isAuth, postController.getAllPosts);

// Handle the creation of the new post. Must be logged in.
router.post('/', isAuth, postController.createPost);


// Show a single, specific post.
router.get('/:id', postController.getPost);

module.exports = router;