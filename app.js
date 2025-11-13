const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const User = require("./models/user");
const Post = require("./models/post");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Connection ---
const MONGODB_URI =
  "mongodb+srv://23520532:23520532@coderhome.0rpsyv7.mongodb.net/?appName=CoderHome";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- View Engine Setup ---
// Set EJS to template engine
app.set("view engine", "ejs");
// Set views folder
app.set("views", path.join(__dirname, "views"));

// --- Middleware ---
// Serve static files (like CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));
// Parse incoming request bodies (for form data)
app.use(express.urlencoded({ extended: true }));
// Parse incoming JSON payloads
app.use(express.json());
// Session Configuration
app.use(
  session({
    secret: "coderhome_secret_key", // Change this to a random string
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    // You can also add 'cookie: { maxAge: ... }'
  })
);

app.use((req, res, next) => {
  // These variables will be available in all EJS templates
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.username = req.session.username || "";
  res.locals.profilePicture = req.session.profilePicture || "/images/default-avatar.png";
  next();
});

// --- Routes ---
// import routes from auth.js
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/profiles");
const currentRoutes = require("./routes/current");
const commentRoutes = require("./routes/comments");

app.use(authRoutes);
app.use("/posts", postRoutes);
app.use("/profiles", userRoutes);
app.use("/current", currentRoutes);
app.use("/comment", commentRoutes);

// Homepage
app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("pages/index", {
      pageTitle: "CoderHome"
    }
    )
  } else {
    // USER IS NOT LOGGED IN
    res.render("pages/landing", {
      pageTitle: "Welcome to Coderhome",
    });
  }
});

app.get("/post/:id", (req, res) => {
  if (req.session.isLoggedIn)
    res.sendFile(path.join(__dirname, "views/pages/post.html"));
  else {
    res.render("pages/landing", {
      pageTitle: "Welcome to Coderhome",
    });
  }
});

app.get("/profile/:id", (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "views/pages/profile.html"));
  } else {
    res.render("pages/landing", {
      pageTitle: "Welcome to Coderhome",
    });
  }
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// ----Them draft ----
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

// Bật live reload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.watch(path.join(__dirname, "views"));

// Tích hợp middleware vào Express
app.use(connectLivereload());

// Khi server reload, gửi lệnh reload browser
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
