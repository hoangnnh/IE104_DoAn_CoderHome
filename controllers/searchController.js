const User = require("../models/user");
const Post = require("../models/post");

async function search(req, res) {
    try {
        const { type, q } = req.query;
        if (!type || !q) {
            return res.status(400).json({ message: "Missing search params" });
        }
        let results = [];

        if (type === "users") {
            const fuzzy = q.split("").join(".*");
            const regex = new RegExp(fuzzy, "i");
            
            results = await User.find({
                $or: [
                    { username: regex },
                    { email: regex }
                ]
            })
            .select("_id username email avatar bio profilePicture");
        }
        else if (type === "posts") {
            results = await Post.find(
                { $text: { $search: q } },
                { score: { $meta: "textScore" } }
            )
            .select("title createdAt thumbnailUrl author description")
            .populate("author", "username profilePicture")
            .sort({ score: { $meta: "textScore" } });
        }
        else {
            return res.status(400).json({ message: "Invalid search type" });
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Search API error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}
module.exports = { search };