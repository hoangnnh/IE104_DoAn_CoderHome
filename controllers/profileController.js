const User = require("../models/user");
const Post = require("../models/post");

// Lay user bang ID, khi bam vao xem user khac.
async function getUser(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: "postedPost",
        select:
          "title description content author thumbnailUrl category createdAt",
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

    console.log("Get Profile Success!", user);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    res.json(user);
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).send("Server Error");
  }
}

module.exports = { getUser };
