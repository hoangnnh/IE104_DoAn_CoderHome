// randomizeCreatedAt.js
const mongoose = require("mongoose");
require("dotenv").config();
const Post = require("../../models/post"); // đổi đường dẫn cho đúng model của bạn

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const posts = await Post.find();

  for (const post of posts) {
    // Sinh ngẫu nhiên ngày trong khoảng 30 ngày gần đây
    const randomDays = Math.floor(Math.random() * 30); // 0 → 29
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - randomDays);

    post.createdAt = randomDate;
    await post.save();
  }

  console.log("✅ Đã cập nhật ngẫu nhiên createdAt cho tất cả post!");
  mongoose.disconnect();
}

main().catch(console.error);
