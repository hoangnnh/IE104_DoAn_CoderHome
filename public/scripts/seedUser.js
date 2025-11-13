const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

// Tốt hơn là dùng environment variable
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://23520532:23520532@coderhome.0rpsyv7.mongodb.net/?appName=CoderHome";
const NUM_USERS = parseInt(process.env.NUM_USERS) || 5;
const PLAIN_PASSWORD = "123";
const SALT_ROUNDS = 5;

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Xóa users cũ nếu cần (optional)
        // await User.deleteMany({ email: /fakeuser.*@fake\.local/ });

        const users = [];
        const timestamp = Date.now();
        
        // Hash password một lần thay vì hash lặp lại NUM_USERS lần
        const hashedPassword = await bcrypt.hash(PLAIN_PASSWORD, SALT_ROUNDS);

        for (let i = 0; i < NUM_USERS; i++) {
            users.push({
                username: `${faker.person.firstName().toLowerCase()}_${faker.string.alphanumeric(5)}`, // tránh trùng
                email: `fakeuser_${timestamp}_${i}@fake.local`, // format rõ ràng hơn
                password: hashedPassword,
                bio: faker.lorem.sentence(),
                profilePicture: faker.image.avatar(),
                backgroundImg: `https://picsum.photos/seed/${timestamp + i}/600/200`,
                role: "User",
                postedPost: [],
                liked: [],
            });
        }

        const inserted = await User.insertMany(users);
        console.log(`🎉 Created ${inserted.length} fake users\n`);

        // Format đẹp hơn khi in ra
        console.log("📋 Login credentials:");
        inserted.forEach((u, idx) => {
            console.log(`${idx + 1}. ${u.email}`);
            console.log(`   Password: ${PLAIN_PASSWORD}`);
            console.log(`   Username: ${u.username}\n`);
        });

        await mongoose.connection.close();
        console.log("🔌 Disconnected from MongoDB");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        await mongoose.connection.close();
        process.exit(1);
    }
})();