// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);

router.get('/logout', authController.getLogout);

module.exports = router;