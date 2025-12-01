const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser,
} = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/**
 * User Routes
 */

// All user routes require authentication
router.use(authenticate);

// User profile routes (authenticated users)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Admin-only routes
router.get('/', authorizeRoles('admin'), getAllUsers);
router.get('/:id', authorizeRoles('admin'), getUserById);
router.delete('/:id', authorizeRoles('admin'), deleteUser);

module.exports = router;

