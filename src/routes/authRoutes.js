const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPasswordHandler,
} = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

/**
 * Authentication Routes
 */

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordHandler);

// Protected routes
router.post('/logout', authenticate, logout);

module.exports = router;

