const User = require('../models/user');
const bcrypt = require('bcryptjs');
const path = require('path');

function getRegister(req, res) {
  res.render('pages/register', {
    pageTitle: 'Register',
    error: null
  });
};

async function postRegister(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const username = `${firstName} ${lastName}`.trim();

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.json({state: "existed", redirectUrl: "/login"});
    }

    const hashedPassword = await bcrypt.hash(password, 12);


    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log('User created successfully!');
    return res.json({state: "success", redirectUrl: "/login"})
  } catch (err) {
    console.error('Registration Error:', err);
    return res.json({state: "error", redirectUrl: "/register"});
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
