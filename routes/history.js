const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/add", async (req, res) => {
  try {
    if (!req.session.userId)
      return res.status(401).json({ message: "Not logged in" });

    const { postId } = req.body;

    await User.findByIdAndUpdate(
      req.session.userId,
      { $addToSet: { history: postId } }, 
      { new: true }
    );

    res.json({ message: "Added to history" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    if (!req.session.userId)
      return res.status(401).json({ message: "Not logged in" });

    const user = await User.findById(req.session.userId)
      .populate("history");

    res.json(user.history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/clear", async (req, res) => {
  try {
    if (!req.session.userId)
      return res.status(401).json({ message: "Not logged in" });

    await User.findByIdAndUpdate(req.session.userId, {
      $set: { history: [] }
    });

    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;