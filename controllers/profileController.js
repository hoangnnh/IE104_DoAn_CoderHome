const User = require("../models/user");
const Post = require("../models/post");

async function getUserProfile(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate({
      path: "postedPost",
      select: "title content author category createdAt",
      populate: { path: "author", select: "username profilePicture" },
    });

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



module.exports = { getUserProfile };
