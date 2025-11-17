const express = require("express");
const router = express.Router();
const searchController = require('../controllers/searchController');
const isAuth = require('../middleware/isAuth');

router.get("/", searchController.search);

module.exports = router;