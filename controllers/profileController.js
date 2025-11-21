const User = require("../models/user");
const Post = require("../models/post");
const path = require("path");

async function getAllUser(req, res) {
  try {
    const users = await User.find()
      .populate({
        path: "followingAuthors",
        select: "_id username bio profilePicture",
      })
      .sort({ createdAt: -1 });
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
          "title description contentHTML author thumbnailUrl category createdAt",
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

    // Filter out undefined/null values
    const updateData = {};
    if (req.body.username !== undefined)
      updateData.username = req.body.username;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

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
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    return res.status(500).json({ message: "Server error" });
  }
}
async function addFollow(req, res) {
  const authorId = req.params.id;
  try {
    if (!req.session.userId)
      return res.status(401).json({ message: "Not logged in" });

    await User.findByIdAndUpdate(
      req.session.userId,
      { $addToSet: { followingAuthors: authorId } },
      { new: true }
    );
    res.json({ message: "Added to followed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function deleteFollow(req, res) {
  const authorId = req.params.id;
  try {
    if (!req.session.userId)
      return res.status(401).json({ message: "Not logged in" });

    await User.findByIdAndUpdate(
      req.session.userId,
      { $pull: { followingAuthors: authorId } }, // XÓA khỏi mảng
      { new: true }
    );
    res.json({ message: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = {
  getUser,
  getAllUser,
  editUserProfile,
  addFollow,
  deleteFollow,
};
