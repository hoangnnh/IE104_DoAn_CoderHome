// middleware/isAuth.js
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    // User is not logged in
    return res.redirect('/login');
  }
  // User is logged in, allow them to continue
  next();
};