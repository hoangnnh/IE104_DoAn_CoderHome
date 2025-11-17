const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const isAuth = require("../middleware/isAuth");


router.get("/", isAuth, profileController.getAllUser);

router.get("/:id", profileController.getUser);

router.put("/:id", profileController.editUserProfile);

module.exports = router;
