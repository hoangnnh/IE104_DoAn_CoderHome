const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Hien thi trang dang ky
function getRegister (req, res) {
  res.render('pages/register');
};
// Xu ly khi nguoi dung dang ky
async function postRegister (req, res) {
  try {
    const { username, email, password } = req.body;
    // Kiem tra user ton tai chua
    const existingUser = await User.findOne({ email: email });

    //Neu ton tai thi dua nguoi dung den trang Log in
    if (existingUser) {
      console.log('Email already in use, please sign in.');
      return res.redirect('/login');
    }
    // Ma hoa mat khau
    const hashedPassword = await bcrypt.hash(password, 12);
    // Tao va luu nguoi dung moi trong database
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

// Hien thi trang Log in
function getLogin (req, res) {
  res.render('pages/login', { pageTitle: 'Login' });
};

// --- Handle User Login ---
async function postLogin (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log('Login attempt failed: Invalid email or password.');
      return res.redirect('/login');
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      console.log('Login attempt failed: Invalid email or password.');
      return res.redirect('/login');
    }

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

function getLogout (req, res) {
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
