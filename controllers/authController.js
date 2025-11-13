const User = require('../models/user');
const bcrypt = require('bcryptjs');
const path = require('path');

function getRegister(req, res) {
  res.sendFile(path.join(__dirname, "views/pages/register.html"));
};

async function postRegister(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const username = `${firstName}${lastName}`.toLowerCase();

    // Check if a user is already existed
    const existingUser = await User.findOne({ email: email });

    // If exists, re-render the page with an error
    if (existingUser) {
      console.log('Email already in use, please sign in.');
      return res.sendFile(path.join(__dirname, "views/pages/register.html"));
    }

    // Password encryption
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save new user to DB
    const user = new User({
      username,
      email,
      password: hashedPassword,
      bio: '',
      profilePicture: '/images/default-avatar.png'
    });
    await user.save();
    console.log('User created successfully!');
    res.redirect('/login');
  } catch (err) {
    console.error('Registration Error:', err);
    res.redirect('/register');
  }
};

function getLogin(req, res) {
  res.sendFile(path.join(__dirname, "views/pages/login.html"));
};

// Handle User Login
async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log('Invalid email!');
      res.sendFile(path.join(__dirname, "views/pages/login.html"));
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      console.log('Invalid password.');
      return res.sendFile(path.join(__dirname, "views/pages/index.html"));
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isLoggedIn = true;
    req.session.profilePicture = user.profilePicture;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      console.log('Login successful, session created.');
      res.redirect('/');
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.redirect('/login');
  }
};

function getLogout(req, res) {
  // This function destroys the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout Error:', err);
    }
    console.log('User logged out.');
    res.redirect('/');
  });
};

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout
};
