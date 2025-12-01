const User = require('../models/User');
const { validate, updateProfileSchema, changePasswordSchema } = require('../utils/validators');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenGenerator');

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'Profile retrieved successfully', { user });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve profile');
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validate(updateProfileSchema, req.body);
    if (error) {
      return errorResponse(res, 400, 'Validation failed', error);
    }

    // Check if email is being updated and if it's already taken
    if (value.email && value.email !== req.user.email) {
      const existingUser = await User.findOne({ email: value.email });
      if (existingUser) {
        return errorResponse(res, 400, 'Email already in use');
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: value },
      {
        new: true,
        runValidators: true,
      }
    );

    return successResponse(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to update profile');
  }
};

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validate(changePasswordSchema, req.body);
    if (error) {
      return errorResponse(res, 400, 'Validation failed', error);
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(value.currentPassword);
    if (!isPasswordValid) {
      return errorResponse(res, 400, 'Current password is incorrect');
    }

    // Update password
    user.password = value.newPassword;
    await user.save();

    // Generate new tokens (optional: force re-login by clearing refresh token)
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return successResponse(
      res,
      200,
      'Password changed successfully',
      {
        accessToken,
        refreshToken,
      }
    );
  } catch (error) {
    return errorResponse(res, 500, 'Failed to change password');
  }
};

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-refreshToken');

    return successResponse(res, 200, 'Users retrieved successfully', { users, count: users.length });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve users');
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (Admin only)
 * @access  Private/Admin
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User retrieved successfully', { user });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to retrieve user');
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 400, 'You cannot delete your own account');
    }

    await User.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to delete user');
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser,
};

