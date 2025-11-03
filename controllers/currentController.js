const User = require("../models/user");

async function getCurrentUser(req, res) {
    try {
        const currentUserID = req.session.userId;
        const currentUserInfo = await User.findById(currentUserID);
        if (!currentUserInfo) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(currentUserInfo);
    } catch (error) {
        console.error("Get Current User Error:", err);
        res.status(500).json({ message: "Server Error" });
    }

}

module.exports = { getCurrentUser }