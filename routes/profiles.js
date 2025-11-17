const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const isAuth = require("../middleware/isAuth");


router.get("/", isAuth, profileController.getAllUser);

router.get("/:id", isAuth, profileController.getUser);

router.patch("/:id", isAuth, profileController.editUserProfile);

module.exports = router;
