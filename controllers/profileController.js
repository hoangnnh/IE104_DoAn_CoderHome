const User = require("../models/user");
const Post = require("../models/post");
const path = require("path");

async function getAllUser(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).send("Server Error");
  }
}

// Lay user bang ID, khi bam vao xem user khac.
async function getUser(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: "postedPosts",
        select:
          "title description content author thumbnailUrl category createdAt",
        populate: { path: "author", select: "username profilePicture" },
      })
      .populate({
        path: "likedPost",
        select: "title content author createdAt",
        populate: { path: "author", select: "username profilePicture" },
      })
      .populate({
        path: "followers",
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

async function editUserProfile(req, res) {
  try {
    const { id } = req.params;
        const updateData = {
            username: req.body.username,
            email: req.body.email,
            bio: req.body.bio
        };

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
  } catch (error) {
    
  }
}

module.exports = { getUser, getAllUser, editUserProfile };
