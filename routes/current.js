const express = require("express");
const router = express.Router();
const currentController = require("../controllers/currentController");
const isAuth = require("../middleware/isAuth"); 

router.get("/", isAuth, currentController.getCurrentUser);

module.exports = router;