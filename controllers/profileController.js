const User = require("../models/user");
const Post = require("../models/post");

//lay profile cua nguoi dung dang dang nhap
async function getOwnProfile(req, res) {
  try {
    const userId = req.session.userId; // lấy ID từ session
    if (!userId) return res.redirect("/login");

    const user = await User.findById(userId).populate({
      path: "postedPost",
      select: "title content author category createdAt",
      populate: { path: "author", select: "username profilePicture" },
    });
    console.log("getOwnProfile - User with posts:", user);
    if (!user) {
      return res.status(404).render("404", { pageTitle: "User Not Found" });
    }

    res.render("pages/profile", {
      pageTitle: "Your Profile",
      user,
    });
  } catch (err) {
    console.error("Get Own Profile Error:", err);
    res.status(500).send("Server Error");
  }
}

// Lay user bang ID, khi bam vao xem user khac.
async function getUserProfile(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: "postedPost",
        select: "title content author category createdAt",
        populate: { path: "author", select: "username profilePicture" },
      })
      .populate({
        path: "liked",
        select: "title content author createdAt",
        populate: { path: "author", select: "username profilePicture" },
      })
      .populate({
        path: "contributors",
        select: "username profilePicture bio postedPost",
        populate: {
          path: "postedPost",
          select: "title content author category createdAt",
        },
      });
    console.log("GetUserProfile - User with posts:", user);
    if (!user) {
      return res.status(404).render("404", { pageTitle: "User Not Found" });
    }

    res.render("pages/profile", {
      pageTitle: user.username,
      user: user,
    });
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).send("Server Error");
  }
}

module.exports = { getUserProfile, getOwnProfile };
