// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// --- Show Registration Form ---
exports.getRegister = (req, res) => {
  res.render('pages/register', { pageTitle: 'Register' });
};

// --- Handle New User Registration ---
exports.postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      // You should add error handling here to inform the user
      console.log('Email already in use.');
      return res.redirect('/register');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      bio: '', // Set default bio
      profilePicture: '/images/default-avatar.png' // Set default pic
    });

    // Save user to database
    await user.save();

    console.log('User created successfully!');
    res.redirect('/login');

  } catch (err) {
    console.error('Registration Error:', err);
    res.redirect('/register');
  }
};

// --- Show Login Form ---
exports.getLogin = (req, res) => {
  res.render('pages/login', { pageTitle: 'Login' });
};

// --- Handle User Login ---
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email: email });
    
    // 2. If user not found, OR if password doesn't match, send same error.
    // We check !user first to avoid an error trying to read 'user.password'
    if (!user) {
      console.log('Login attempt failed: Invalid email or password.');
      // TODO: Add a flash message here for the user
      return res.redirect('/login');
    }

    // 3. User was found, now compare passwords
    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      // Passwords do not match
      console.log('Login attempt failed: Invalid email or password.');
      // TODO: Add a flash message here for the user
      return res.redirect('/login');
    }

    // 4. Success! User is valid AND password is correct.
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isLoggedIn = true;

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

// --- Handle User Logout ---
exports.getLogout = (req, res) => {
  // This function destroys the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout Error:', err);
    }
    console.log('User logged out.');
    res.redirect('/');
  });
};