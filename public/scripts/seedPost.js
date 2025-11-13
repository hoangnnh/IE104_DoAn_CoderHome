const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Post = require("../../models/post");
const User = require("../../models/user");
require('dotenv').config();


const MONGO_URI = process.env.MONGO_URI;
const NUM_POSTS = parseInt(process.env.NUM_POSTS) || 100;
const PEXELS_API_KEY = process.env.PEXELS_KEY;

const CATEGORIES = ["General", "Tech", "Life", "Career", "Tutorial", "News"];
const TAGS = ["javascript", "html", "css", "nodejs", "react", "mongodb", "express", "api", "frontend", "backend"];

const IT_KEYWORDS = [
    "programming",
    "coding",
    "computer",
    "laptop",
    "developer",
    "software",
    "technology",
    "javascript",
    "code",
    "workspace"
];

async function getPexelsITImage(width = 800, height = 500) {
    const keyword = faker.helpers.arrayElement(IT_KEYWORDS);
    const page = faker.number.int({ min: 1, max: 10 });
    const url = `https://api.pexels.com/v1/search?query=${keyword}&per_page=1&page=${page}&orientation=landscape`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });
        const data = await response.json();
        
        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.large;
        }
        
        // Fallback
        return `https://dummyimage.com/${width}x${height}/333/fff&text=Tech+Image`;
    } catch (error) {
        console.error("Error fetching Pexels image:", error);
        return `https://dummyimage.com/${width}x${height}/333/fff&text=Tech+Image`;
    }
}

async function generateContentWithITImages(numParagraphs = 10, numImages = 3) {
    const paragraphs = [];
    const paragraphsPerImage = Math.floor(numParagraphs / (numImages + 1));
    
    for (let i = 0; i < numParagraphs; i++) {
        paragraphs.push(`<p>${faker.lorem.paragraph()}</p>`);
        
        if ((i + 1) % paragraphsPerImage === 0 && paragraphs.filter(p => p.includes('<img')).length < numImages) {
            const imageUrl = await getPexelsITImage(800, 500);
            const keyword = faker.helpers.arrayElement(IT_KEYWORDS);
            
            paragraphs.push(`
                <figure style="margin: 30px 0; text-align: center;">
                    <img src="${imageUrl}" 
                         alt="${keyword}" 
                         style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" 
                         loading="lazy" />
                    <figcaption style="color: #666; font-size: 14px; margin-top: 10px; font-style: italic;">
                        ${faker.lorem.sentence().replace(/\.$/, '')}
                    </figcaption>
                </figure>
            `);
        }
    }
    
    return paragraphs.join('\n');
}

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find();
        if (users.length === 0) {
            throw new Error("User not found!");
        }

        console.log(`Found ${users.length} users`);
        const posts = [];

        for (let i = 0; i < NUM_POSTS; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            
            console.log(`Creating post ${i + 1}/${NUM_POSTS}...`);
            
            posts.push({
                title: faker.lorem.sentence({ min: 5, max: 10 }).replace(/\.$/, ''),
                description: faker.lorem.sentences(2),
                content: await generateContentWithITImages(10, 3),
                thumbnailUrl: await getPexelsITImage(800, 400),
                author: randomUser._id,
                category: faker.helpers.arrayElement(CATEGORIES),
                tags: faker.helpers.arrayElements(TAGS, { min: 1, max: 4 }),
            });
        }

        const insertedPosts = await Post.insertMany(posts);
        console.log(`\nCreated ${insertedPosts.length} fake posts with Pexels IT images`);

        const userPostsMap = {};
        
        insertedPosts.forEach(post => {
            const authorId = post.author.toString();
            if (!userPostsMap[authorId]) {
                userPostsMap[authorId] = [];
            }
            userPostsMap[authorId].push(post._id);
        });

        const updatePromises = Object.entries(userPostsMap).map(([userId, postIds]) => {
            return User.findByIdAndUpdate(
                userId,
                { $push: { postedPost: { $each: postIds } } }
            );
        });

        await Promise.all(updatePromises);
        console.log(`🔗 Updated postedPost for ${Object.keys(userPostsMap).length} users`);

        console.log("\nSummary:");
        for (const [userId, postIds] of Object.entries(userPostsMap)) {
            const user = users.find(u => u._id.toString() === userId);
            console.log(`   - ${user.username}: ${postIds.length} posts`);
        }

        await mongoose.connection.close();
        console.log("\nDisconnected from MongoDB");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
})();