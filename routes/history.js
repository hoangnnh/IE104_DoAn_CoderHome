// routes/history.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Thêm vào lịch sử xem
router.post("/add", async (req, res) => {
  try {
    // kiểm tra người dùng đã đăng nhập
    if (!req.session.userId)
      return res.status(401).json({ message: "Not logged in" });

    const { historyPostId } = req.body; //ID bài viết đã xem

    await User.findByIdAndUpdate(
      req.session.userId,
      { $addToSet: { history: historyPostId } }, 
      { new: true }
    );

    res.json({ message: "Added to history" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// lấy danh sách lịch sử xem
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

// Xoá lịch sử xem
router.delete("/clear", async (req, res) => {
  try {
    if (!req.session.userId)
      return res.status(401).json({ message: "Not logged in" });
    
    // set mảng về rỗng
    await User.findByIdAndUpdate(req.session.userId, {
      $set: { history: [] }
    });

    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;