const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

require("dotenv").config();

const User = require("./models/user");
const Post = require("./models/post");

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
const MONGODB_URI =
  "mongodb+srv://23520532:23520532@coderhome.0rpsyv7.mongodb.net/?appName=CoderHome";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// // Set EJS to template engine
// app.set("view engine", "ejs");
// // Set views folder
// app.set("views", path.join(__dirname, "views"));

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
    secret: "coderhome_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  // These variables will be available in all EJS templates
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.username = req.session.username || "";
  res.locals.profilePicture =
    req.session.profilePicture || "/images/default-avatar.png";
  next();
});

// import routes from auth.js
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/profiles");
const currentRoutes = require("./routes/current");
const commentRoutes = require("./routes/comments");
const searchRoutes = require("./routes/search");


app.use(authRoutes);
app.use("/posts", postRoutes);
app.use("/profiles", userRoutes);
app.use("/current", currentRoutes);
app.use("/comments", commentRoutes);
app.use("/search", searchRoutes);

// Homepage
app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "views/pages/index.html"));
  } else {
    res.sendFile(path.join(__dirname, "views/pages/landing.html"));
  }
});

app.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/login.html"));
});

app.get("/register", async (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/register.html"));
});

app.get("/admin", async (req, res) => {
  if (req.session.isLoggedIn && req.session.isAdmin === 1) {
    res.sendFile(path.join(__dirname, "views/pages/admin.html"));
  } else {
    res.sendFile(path.join(__dirname, "views/pages/landing.html"));
  }
});


// Post Route

app.get("/post/:id", (req, res) => {
  if (req.session.isLoggedIn)
    res.sendFile(path.join(__dirname, "views/pages/post.html"));
  else {
    res.sendFile(path.join(__dirname, "views/pages/landing.html"));
  }
});

// Profile Route

app.get("/profile/:id", (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "views/pages/profile.html"));
  } else {
    res.sendFile(path.join(__dirname, "views/pages/landing.html"));
  }
});
// Following Route

app.get("/following", (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "views/pages/following.html"));
  } else {
    res.sendFile(path.join(__dirname, "views/pages/landing.html"));
  }
});

// Library Page Route
 app.get("/library", (req, res) => {
    if (req.session.isLoggedIn) {
      res.sendFile(path.join(__dirname, "views/pages/library.html"));
    } else {
      res.sendFile(path.join(__dirname, "views/pages/landing.html"));
    }
  });

// History Route
 const historyRoutes = require("./routes/history");
 app.use("/history", historyRoutes);
 
// Write page

app.get("/write", (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "views/pages/write.html"));
  } else {
    res.sendFile(path.join(__dirname, "views/pages/landing.html"));
  }
});

app.get("/search-result", (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "views/pages/search.html"));
  } else {
    res.sendFile(path.join(__dirname, "views/pages/landing.html"));
  }
});

// Other pages

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/about.html"));
});

app.get("/help", (req, res) => {
  res.sendFile(path.join(__dirname, "views/pages/help.html"));
});

app.get("/settings", (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "views/pages/setting.html"));
  } else {
    res.sendFile(path.join(__dirname, "views/pages/landing.html"));
  }
});

// 404 pages
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views/pages/404.html"));
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.watch(path.join(__dirname, "views"));

app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
