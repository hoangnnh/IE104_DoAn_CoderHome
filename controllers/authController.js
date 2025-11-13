const User = require('../models/user');
const bcrypt = require('bcryptjs');

function getRegister(req, res) {
  res.render('pages/register', {
    pageTitle: 'Register',
    error: null
  });
};

async function postRegister(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const username = `${firstName}${lastName}`.toLowerCase();

    // Check if a user is already existed
    const existingUser = await User.findOne({ email: email });

    // If exists, re-render the page with an error
    if (existingUser) {
      return res.redirect('/login');
    }
    // Password encryption
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save new user to DB
    const user = new User({
      username,
      email,
      password: hashedPassword,
      bio: '',
      profilePicture: '/images/user-avatar.jpg'
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
  res.render('pages/login', { pageTitle: 'Login', error: null });
};

// Handle User Login
async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({state: "invalid"});
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      return res.json({state: "invalid"});
    }
    const isAdmin = user.role;

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isLoggedIn = true;
    req.session.isAdmin = (isAdmin === "Admin") ? 1 : 0;
    req.session.profilePicture = user.profilePicture;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      console.log('Login successful, session created.');

      if (req.session.isAdmin === 0)
      return res.json({state: "success", redirectUrl: "/"});
      else return res.json({state: "success", redirectUrl: "/admin"});
    });

  } catch (err) {
    console.error('Login Error:', err);
    return res.json({state: "error", redirectUrl: "/login"});
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
