// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /register - Show registration form
// router.get('/register', authController.getRegister);

// POST /register - Handle new user registration
router.post('/register', authController.postRegister);

// GET /login - Show login form
// router.get('/login', authController.getLogin);

// POST /login - Handle user login
router.post('/login', authController.postLogin);

// GET /logout - Handle user logout
router.get('/logout', authController.getLogout);

module.exports = router;