// routes/posts.js
const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController');
const isAuth = require('../middleware/isAuth');

router.get("/", isAuth, postController.getAllPosts);

router.post('/', isAuth, postController.createPost);

router.get('/stats', isAuth, postController.getStats);

router.get('/:id', isAuth, postController.getPost);



module.exports = router;
